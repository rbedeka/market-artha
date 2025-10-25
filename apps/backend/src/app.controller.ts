import { Controller, Get } from '@nestjs/common';
import { AppService, PingService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly pingService: PingService,
  ) {}

  @Get()
  getHello(): string {
    return this.pingService.ping();
  }
}
