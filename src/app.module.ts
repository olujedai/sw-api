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

@Module({
  imports: [MoviesModule, RequestModule, CharacterModule, UtilsModule, CommentModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: String(process.env.DATABASE_HOST),
      port: Number(process.env.DATABASE_PORT),
      username: String(process.env.DATABASE_USER),
      password: String(process.env.DATABASE_PASSWORD),
      database: String(process.env.DATABASE_NAME),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
