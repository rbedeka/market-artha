import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Console, Effect } from 'effect';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from 'src/errors/nestEquivalentErrors.error';
import { LoginAttemptService } from './login-attempt.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    // private prisma: PrismaService,
    private jwtService: JwtService,
    private loginAttemptService: LoginAttemptService,
    private userService: UsersService,
  ) {}

  cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  // Validate user credentials
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not Found');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async loginFlow(
    email: string,
    password: string,
    captchaToken: string | null,
    reqIp: string,
  ) {
    const cacheIdentifier = this.loginAttemptService.getCacheKey(email, reqIp);

    const captchaRequired = await this.loginAttemptService
      .shouldRequireCaptcha(cacheIdentifier)
      .catch((err) => {
        throw new ServiceUnavailableError({
          message: `Failed to check captcha requirement: ${JSON.stringify(
            err,
          )}`,
          serviceName: 'Captcha',
        });
      });

    if (captchaRequired && !captchaToken) {
      throw new UnauthorizedError({
        message: 'Captcha required after multiple failed login attempts',
      });
    }

    return Effect.tryPromise({
      try: () => this.validateUser(email, password),
      catch: (err) =>
        new UnauthorizedError({
          message: `Failed to validate user credentials: ${JSON.stringify(
            err,
          )}`,
        }),
    }).pipe(
      Effect.zipLeft(
        Effect.promise(() =>
          this.loginAttemptService.resetAttempts(cacheIdentifier),
        ),
      ),
      Effect.catchTag('UnauthorizedError', (err) =>
        Effect.promise(() =>
          this.loginAttemptService.recordFailedAttempt(cacheIdentifier),
        ).pipe(Effect.zipRight(Effect.fail(err))),
      ),
      Effect.either,
      Effect.runPromise,
    );
  }

  // Generate JWT token
  async login(user: { id: number; email: string }, res: Response) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // store hashed refresh token as before
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.userService.setRefreshTokenHash(user.id, refreshTokenHash);

    // Set HttpOnly cookies
    res.cookie('access_token', accessToken, {
      ...this.cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie('refresh_token', refreshToken, {
      ...this.cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send minimal body response, tokens in cookies
    return { user: { id: user.id, email: user.email } };
  }
  // Register user
  async register(data: { email: string; password: string; username: string }) {
    const user = await this.userService.createUser(data);
    return user;
  }

  async refreshTokens(refreshToken: string, userId: number, res: Response) {
    // const refreshToken = req.cookies['refresh_token'];
    // const userId = req.body.userId;

    if (!refreshToken || !userId) throw new UnauthorizedException();

    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new UnauthorizedException();

    // Generate new tokens, update cookies as above
    return this.login({ id: user.id, email: user.email }, res);
  }

  async logout(userId: number, res: Response) {
    await this.userService.removeRefreshToken(userId);

    res.clearCookie('access_token', this.cookieOptions);
    res.clearCookie('refresh_token', this.cookieOptions);
  }
}
