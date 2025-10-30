import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { TurnstileCaptcha } from 'nest-cloudflare-turnstile';
import { Either } from 'effect';
import { mapCustomErrorToNestException } from 'src/errors/nestEquivalentErrors.error';
import { UsersService } from 'src/users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from 'src/dto/login.dto';
import { RegisterDto } from 'src/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
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
  @UseGuards(LocalAuthGuard)
  @TurnstileCaptcha()
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginFlow(
      body.email.toLowerCase(),
      body.password,
      body.captchaToken || null,
      req.ip || 'unknown',
    );

    const user = await result.pipe(
      Either.match({
        onLeft: (err) => mapCustomErrorToNestException(err),
        onRight: (user) => this.authService.login(user, res),
      }),
    );

    console.log(user);

    return { status: 'ok', user };
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    const exists = !!(await this.userService.findByEmail(email));
    return { exists };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(1, res);
  }
}
