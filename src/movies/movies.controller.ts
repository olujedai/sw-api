import { Request } from 'express';
import { Controller, Get, Query, Param, Req, Body, Post, Header } from '@nestjs/common';
import { ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { CommentService } from '../comment/comment.service';
import { CommentBodyDto } from '../comment/dto/comment.dto';
import { CommentResponseDto } from '../comment/dto/commentResponse.dto';
import { Comment } from '../comment/comment.entity';
import { CharacterService } from '../character/character.service';
import { CharactersDto } from '../character/dto/characters.dto';
import { MovieParamDto } from './movies.param.dto';
import { CharacterQueryDto } from '../character/dto/character.query.dto';
import { MoviesService } from './movies.service';
import { MovieDto } from './dto/movies.dto';
import { UtilsService } from '../utils/utils.service';
import { MovieValidator } from './movies.validator';

/*
Provides methods for accepting requests and responding to them
*/
@ApiUseTags('sw-api')
@Controller('movies')
export class MoviesController {
    constructor(
      private readonly movieService: MoviesService,
      private readonly commentService: CommentService,
      private readonly characterService: CharacterService,
      private readonly utilsService: UtilsService,
      private readonly movieValidator: MovieValidator,
    ) {}

    @Get()
    @ApiResponse({ status: 200, type: [MovieDto]})
    async getMovies(): Promise<MovieDto[]> {
      return await this.movieService.getMovies();
    }

    @Get(':movieId/comments')
    @ApiResponse({ status: 200, type: CommentResponseDto})
    async findAllMovieComments(@Param() param: MovieParamDto, @Query() query: {skip: number, size: number}): Promise<CommentResponseDto> {
        const movieId: number = param.movieId;
        await this.movieValidator.validateMovieId(movieId);
        const { skip, size } = query;
        const filter: MovieParamDto = {
            movieId,
        };
        const response: [Comment[], number] = await this.commentService.findAll(skip, size, filter);
        const comments: Comment[] = response[0];
        const count: number = response[1];
        return {
            comments,
            count,
        };
    }

    @Post(':movieId/comments')
    @Header('Content-Type', 'application/json')
    @ApiResponse({ status: 200, type: Comment})
    async saveComment(@Param() param: MovieParamDto, @Req() request: Request, @Body() body: CommentBodyDto): Promise<Comment> {
        const movieId: number = param.movieId;
        await this.movieValidator.validateMovieId(movieId);
        const ipAddress: string = this.utilsService.getIpAddress(request);
        const {comment} = body;
        return await this.commentService.createComment(movieId, ipAddress, comment);
    }

    @Get(':movieId/characters')
    @ApiResponse({ status: 200, type: CharactersDto})
    async getCharacters(@Param() param: MovieParamDto, @Query() query: CharacterQueryDto): Promise<CharactersDto> {
        const {sort, order, filter} = query;
        const movieId: number = param.movieId;
        const movie: MovieDto = await this.movieValidator.validateMovieId(movieId);
        const characters: string[] = movie.characters;
        return await this.characterService.getCharacters(characters, sort, order, filter);
    }
}
