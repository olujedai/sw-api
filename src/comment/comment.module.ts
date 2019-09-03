import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { UtilsModule } from '../utils/utils.module';

/**
 * The providers, imports and exports of the Comment module are registered here
 */

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UtilsModule],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
