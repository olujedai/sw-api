import { Request } from 'express';
import { Controller, Get, Query, Param, Req, Body, Post, Header } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { CommentService } from '../comment/comment.service';
import { CommentParamDto } from '../comment/comment.param.dto';
import { CommentDto } from '../comment/comment.dto';
import { Comment } from '../comment/comment.entity';
import { MoviesService } from './movies.service';
import { MovieDto } from './movies.dto';
import { UtilsService } from '../utils/utils.service';

@ApiUseTags('sw-api')
@Controller('movies')
export class MoviesController {
    constructor(
      private readonly movieService: MoviesService,
      private readonly commentService: CommentService,
      private readonly utilsService: UtilsService,
    ) {}

    @Get()
    async getMovies(): Promise<MovieDto[]> {
      return await this.movieService.getMovies();
    }

    @Get(':movieId/comments')
    async findAllMovieComments(@Param() param: CommentParamDto, @Query() query) {
        const movieId = param.movieId;
        const { skip, size } = query;
        const filter = {
            movieId,
        };
        const response = await this.commentService.findAll(skip, size, filter);
        const comments = response[0];
        const count = response[1];
        return {
            comments,
            count,
        };
    }

    @Post(':movieId/comments')
    @Header('Content-Type', 'application/json')
    async saveComment(@Param() param: CommentParamDto, @Req() request: Request, @Body() body: CommentDto): Promise<Comment> {
        const movieId = param.movieId;
        const ipAddress = this.utilsService.getIpAddress(request);
        const {comment, commenter} = body;
        return await this.commentService.createComment(movieId, ipAddress, comment, commenter);
    }
}
