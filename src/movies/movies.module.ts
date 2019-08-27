import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { RequestModule } from '../request/request.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [RequestModule, UtilsModule],
  exports: [MoviesService],
})
export class MoviesModule {}
