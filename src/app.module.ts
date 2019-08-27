import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { RequestModule } from './request/request.module';
import { CharacterModule } from './character/character.module';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [MoviesModule, RequestModule, CharacterModule, UtilsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
