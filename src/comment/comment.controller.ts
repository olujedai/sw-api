import { Controller, Post, Get, Query, Req, Body, Param, Header } from '@nestjs/common';
import { CommentService } from './comment.service';
import { UtilsService } from '../utils/utils.service';
import { Request } from 'express';
import { CommentDto } from './comment.dto';
import { CommentParamDto } from './comment.param.dto';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly utilsService: UtilsService,
    ) {}

    @Post(':movieId')
    @Header('Content-Type', 'application/json')
    async saveComment(@Param() param: CommentParamDto, @Req() request: Request, @Body() body: CommentDto) {
        const movieId = param.movieId;
        const ipAddress = this.utilsService.getIpAddress(request);
        const {comment, commenter} = body;
        return await this.commentService.createComment(movieId, ipAddress, comment, commenter);
    }

    @Get(':movieId')
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
}
