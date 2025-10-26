import { Controller, Post, Body } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() body: any) {
    console.log('Received registration data:', body);
    // For now, just echo the received data and return ok

    return { status: 'ok' };
  }

  @Post('login')
  login(@Body() body: any) {
    console.log('Received login data:', body);
    // For now, just echo the received data and return ok

    return { status: 'ok' };
  }
}
