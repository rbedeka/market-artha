import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Console, Effect } from 'effect';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from 'src/errors/nestEquivalentErrors.error';
import { LoginAttemptService } from './login-attempt.service';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    // private prisma: PrismaService,
    private jwtService: JwtService,
    private loginAttemptService: LoginAttemptService,
    private userService: UsersService,
  ) {}

  // Validate user credentials
  async validateUser(email: string, pass: string) {
    // const _user = await this.prisma.user.findUnique({ where: { email } });
    const user = await this.userService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password: _password, ...result } = user;
      void _password;
      return result;
    }
    return null;
  }

  loginFlow(
    email: string,
    password: string,
    captchaToken: string | null,
    reqIp: string,
  ) {
    const loginFlow = Effect.Do.pipe(
      Effect.bind('cacheIdentifier', () =>
        Effect.sync(() => this.loginAttemptService.getCacheKey(email, reqIp)),
      ),

      Effect.bind('isCaptchaRequired', ({ cacheIdentifier }) =>
        Effect.tryPromise({
          try: () =>
            this.loginAttemptService.shouldRequireCaptcha(cacheIdentifier),
          catch: (err) =>
            new ServiceUnavailableError({
              message: `Failed to check captcha requirement: ${JSON.stringify(err)}`,
              serviceName: 'Captcha',
            }),
        }),
      ),

      Effect.tap(({ isCaptchaRequired }) =>
        Effect.if({
          onFalse: () => Effect.succeed(undefined),
          onTrue: () =>
            Effect.log('Captcha is required for this login attempt').pipe(
              Effect.flatMap(() =>
                Effect.fail(
                  new UnauthorizedError({
                    message:
                      'Captcha required after multiple failed login attempts',
                  }),
                ),
              ),
            ),
        })(isCaptchaRequired && !captchaToken),
      ),
      Effect.bind('validatedUser', () =>
        Effect.tryPromise({
          try: () => this.validateUser(email, password),
          catch: (err) =>
            new UnauthorizedError({
              message: `Failed to validate user credentials: ${JSON.stringify(err)}`,
            }),
        }),
      ),
      Effect.tap(({ validatedUser, cacheIdentifier }) =>
        Effect.if({
          onFalse: () =>
            Effect.succeed({
              message: 'Login successful',
              user: validatedUser,
            }).pipe(
              Effect.tap(() =>
                Effect.promise(() =>
                  this.loginAttemptService.resetAttempts(cacheIdentifier),
                ),
              ),
            ),
          onTrue: () =>
            Effect.promise(() =>
              this.loginAttemptService.recordFailedAttempt(cacheIdentifier),
            ).pipe(
              Effect.flatMap(() =>
                Effect.fail(
                  new UnauthorizedError({
                    message: 'Invalid email or user credentials',
                  }),
                ),
              ),
            ),
        })(!validatedUser),
      ),
      Effect.tap(({ cacheIdentifier }) =>
        Effect.promise(() =>
          this.loginAttemptService.getAttempts(cacheIdentifier),
        ).pipe(Effect.tap((a) => Console.log(`Attempts for : ${a}`))),
      ),
      Effect.map(({ validatedUser }) => validatedUser),
      Effect.either,
      Effect.runPromise,
    );

    return loginFlow;
  }

  // Generate JWT token
  login(user: { id: number; email: string }) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Register user
  async register(data: { email: string; password: string; username: string }) {
    const user = await this.userService.createUser(data);
    return user;
  }

  async checkEmailAvailability(email: string) {
    const user = await this.userService.findByEmail(email);
    return !!user;
  }
}
