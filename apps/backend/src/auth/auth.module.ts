import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { BackendEnv } from '@market-artha/shared';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginAttemptService } from './login-attempt.service';
import { UsersService } from 'src/users/users.service';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { APP_CONFIG } from 'src/config/config.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (appConfig: BackendEnv) => ({
        secret: appConfig.JWT_ACCESS_SECRET,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [APP_CONFIG],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginAttemptService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
