import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { RequestModule } from '../request/request.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [CharacterService],
  controllers: [CharacterController],
  imports: [RequestModule, UtilsModule],
  exports: [CharacterService],
})
export class CharacterModule {}
