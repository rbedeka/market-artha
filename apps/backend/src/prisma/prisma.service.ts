import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { Console, Context, Data, Effect, Layer } from 'effect';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

export class _PrismaConnectionError extends Data.TaggedError(
  'PrismaConnectionError',
)<{
  message: string;
}> {}
export class _PrismaService extends Context.Tag('PrismaService')<
  _PrismaService,
  PrismaClient
>() {}

export const PrismaLive = Layer.effect(
  _PrismaService,
  Effect.gen(function* () {
    const prisma = new PrismaClient();

    yield* Effect.tryPromise({
      try: () =>
        prisma.$connect().then(() => console.log('PrismaService DB connected')),
      catch: (err) =>
        new _PrismaConnectionError({ message: JSON.stringify(err) }),
    });

    return prisma;
  }),
);
