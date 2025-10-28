import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, PingService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { LoginAttemptService } from './auth/login-attempt.service';
import { TurnstileModule } from 'nest-cloudflare-turnstile';
import { Request } from 'express';
import KeyvRedis from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = process.env.REDIS_PORT || '6379';
        const redisUrl = `redis://${redisHost}:${redisPort}`;
        const redisStore = new KeyvRedis(redisUrl);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        const altStore = new Keyv({
          store: new CacheableMemory({
            ttl: 60000,
            lruSize: 5000,
          }),
        });
        return {
          stores: [redisStore, altStore],
          ttl: 600000, // 10 minutes in milliseconds
        };
      },
    }),
    TurnstileModule.forRoot({
      secretKey: process.env.TURNSTILE_SECRET_KEY!,
      tokenResponse: (req: Request) => {
        const body = req.body as Record<string, unknown>;
        const value = Object.prototype.hasOwnProperty.call(body, 'captchaToken')
          ? body['captchaToken']
          : '';
        return value as string;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PingService, LoginAttemptService],
})
export class AppModule {}
