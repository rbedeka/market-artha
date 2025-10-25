import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, PingService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, PingService],
})
export class AppModule {}
