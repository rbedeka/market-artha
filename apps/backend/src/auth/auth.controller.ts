import { Controller, Post, Body, Get, Query, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAttemptService } from './login-attempt.service';
import type { Request } from 'express';
import { TurnstileCaptcha } from 'nest-cloudflare-turnstile';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';
import { Either } from 'effect';
import { mapCustomErrorToNestException } from 'src/errors/nestEquivalentErrors.error';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loginAttemptService: LoginAttemptService,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    console.log('Received registration data:', body);
    // For now, just echo the received data and return ok
    const registeredUser = await this.authService.register({
      email: body.email,
      password: body.password,
      username: body.username,
    });

    return { status: 'ok', registeredUser };
  }

  @Post('login')
  @TurnstileCaptcha()
  async login(@Body() body: LoginDto, @Req() req: Request) {
    const result = await this.authService.loginFlow(
      body.email.toLowerCase(),
      body.password,
      body.captchaToken || null,
      req.ip || 'unknown',
    );

    const user = result.pipe(
      Either.match({
        onLeft: (err) => mapCustomErrorToNestException(err),
        onRight: (user) => user,
      }),
    );

    return { status: 'ok', user };
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const exists = await this.authService.checkEmailAvailability(email);
    return { exists };
  }
}
