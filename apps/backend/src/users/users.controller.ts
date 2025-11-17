// src/users/users.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import { InvalidCredentialsError } from '@market-artha/shared/error';

interface RequestWithUser extends Request {
  user?: User;
}

@Controller('user')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    // user is attached to req.user by JwtStrategy validate()
    if (!req.user) {
      throw new InvalidCredentialsError({
        message: 'User not found for JWT payload',
        context: { req },
      });
    }
    // Return necessary user info
    return {
      id: req.user.id,
      email: req.user.email,
      //   role: req.user.role,
    };
  }
}
