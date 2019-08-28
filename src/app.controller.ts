import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('server')
@Controller('is-alive')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getIsAlive(): string {
    return this.appService.getIsAlive();
  }
}
