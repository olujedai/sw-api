import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

/**
 * The providers and exports of the Logger module are registered here
 */

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
