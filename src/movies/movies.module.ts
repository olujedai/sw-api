import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { RequestModule } from '../request/request.module';
import { UtilsModule } from '../utils/utils.module';
import { CommentModule } from '../comment/comment.module';
import { CharacterModule } from '../character/character.module';
import { MovieExists } from './dto/movieExists.validator';
/**
 * The controllers, providers, imports and exports of the Movies module are registered here
 */
@Module({
  controllers: [MoviesController],
  providers: [MoviesService, MovieExists],
  imports: [RequestModule, UtilsModule, CommentModule, CharacterModule],
  exports: [MoviesService],
})
export class MoviesModule {}
