import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { RequestModule } from './request/request.module';
import { CharacterModule } from './character/character.module';
import { UtilsModule } from './utils/utils.module';
import { CommentModule } from './comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import { config } from './ormconfig';

@Module({
  imports: [MoviesModule, RequestModule, CharacterModule, UtilsModule, CommentModule,
    TypeOrmModule.forRoot(config),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
