import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { RequestModule } from '../request/request.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [RequestModule],
  exports: [MoviesService],
})
export class MoviesModule {}
