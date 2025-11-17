import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TurnstileModule } from 'nest-cloudflare-turnstile';
import { Request } from 'express';
import KeyvRedis from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_CONFIG, ConfigProviderModule } from './config/config.module';
import { BackendEnv } from '@market-artha/shared';

@Module({
  imports: [
    ConfigProviderModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (appConfig: BackendEnv) => {
        const redisHost = appConfig.REDIS_HOST;
        const redisPort = appConfig.REDIS_PORT;
        const redisUrl = `redis://${redisHost}:${redisPort}`;
        const redisStore = new KeyvRedis(redisUrl);

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
      inject: [APP_CONFIG],
    }),
    TurnstileModule.forRootAsync({
      inject: [APP_CONFIG],
      useFactory: (appConfig: BackendEnv) => ({
        secretKey: appConfig.TURNSTILE_SECRET_KEY,
        tokenResponse: (req: Request) => {
          const body = req.body as Record<string, unknown>;
          const value = Object.prototype.hasOwnProperty.call(
            body,
            'captchaToken',
          )
            ? body['captchaToken']
            : '';
          return value as string;
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
