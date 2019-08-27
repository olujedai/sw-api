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

    findAll(skip, size, filter): Promise<[Comment[], number]> {
        return this.commentRepository.findAndCount({
            where: filter,
            order: {
                dateCreated: 'DESC',
            },
            skip: Number(skip),
            take: Number(size || 20),
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
