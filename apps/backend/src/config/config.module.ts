import { Global, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import { BackendEnv, parseBackendEnv } from '@market-artha/shared';

/**
 * Token to inject the validated BackendEnv configuration
 */
export const APP_CONFIG = Symbol('APP_CONFIG');

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      validate: (env) => parseBackendEnv(env),
      isGlobal: true,
      envFilePath: '../../.env',
    }),
  ],
  providers: [
    {
      provide: APP_CONFIG,
      useFactory: (configService: ConfigService): BackendEnv =>
        configService.get<BackendEnv>('APP_CONFIG') ||
        parseBackendEnv(process.env),
      inject: [ConfigService],
    },
  ],
  exports: [APP_CONFIG, NestConfigModule],
})
export class ConfigProviderModule {}
