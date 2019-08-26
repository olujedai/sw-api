import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [MoviesModule, RequestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
