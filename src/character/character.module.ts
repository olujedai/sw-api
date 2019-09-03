import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { RequestModule } from '../request/request.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [CharacterService],
  imports: [RequestModule, UtilsModule],
  exports: [CharacterService],
})
export class CharacterModule {}
