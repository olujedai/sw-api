import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { RequestModule } from '../request/request.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  providers: [CharacterService],
  controllers: [CharacterController],
  imports: [RequestModule, MoviesModule],
})
export class CharacterModule {}
