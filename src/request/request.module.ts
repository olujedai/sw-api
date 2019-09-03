import { Module } from '@nestjs/common';
import { RequestService } from './request.service';

/**
 * The providers exports of the Request module are registered here
 */

@Module({
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
