import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
      ) {}

      async findAll(skip, size, filter): Promise<[Comment[], number]> {
        return await this.commentRepository.findAndCount({
            where: filter,
            order: {
                dateCreated: 'DESC',
            },
            skip: Number(skip),
            take: Number(size || 20),
        });
    }

    count(filter): Promise<number> {
        return this.commentRepository.count({
            where: filter,
        });
    }

    createComment(movieId, ipAddress, comment, commenter): Promise<Comment> {
        const newComment = new Comment();
        newComment.movieId = movieId;
        newComment.ipAddress = ipAddress;
        newComment.comment = comment;
        newComment.commenter = commenter;
        return this.commentRepository.save(newComment);
    }
}
