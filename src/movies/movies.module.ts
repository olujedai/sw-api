import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { RequestModule } from '../request/request.module';
import { UtilsModule } from '../utils/utils.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [RequestModule, UtilsModule, CommentModule],
  exports: [MoviesService],
})
export class MoviesModule {}
