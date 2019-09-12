import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

/**
 * The methods that provide the logic for interacting with the Comments database table are defined here.
 */

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) {}

    async findAll(skip: number, size: number, filter: { movieId: number; }): Promise<[Comment[], number]> {
        /**
         * Retrieves all the results that match the query along with a count of the number of results match that query.
         * @param skip the number of queries to skip. Used for paginating the database response
         * @param size the number of items to be retrieved from the database
         * @param filter the filter that should be applied to the database query
         * @returns the number of responses that match the filter and all the comments that match the query
         */
        return await this.commentRepository.findAndCount({
            where: filter,
            order: {
                dateCreated: 'DESC',
            },
            skip,
            take: size || 20,
        });
    }

    countMovieComments(filter: { movieId: number; }): Promise<number> {
        /**
         * Counts the results that match a filter.
         * @param filter the filter that should be applied to the database query
         * @returns the number of results that match the filter
         */
        return this.commentRepository.count({
            where: filter,
        });
    }

    createComment(movieId: number, ipAddress: string, comment: string, commenter: string): Promise<Comment> {
        /**
         * Creates a comment in the database table and returns the comments
         * @param movieId the ID of the movie which the comment is for.
         * @param ipAddress the IP Address of the user posting this comment.
         * @param comment the comment sent by the user
         * @param commenter the user posting this comment.
         * @returns the Comment object.
         */
        const newComment = new Comment();
        newComment.movieId = movieId;
        newComment.ipAddress = ipAddress;
        newComment.comment = comment;
        newComment.commenter = commenter;
        return this.commentRepository.save(newComment);
    }
}
