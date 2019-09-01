import { Request } from 'express';
import { Controller, Get, Query, Param, Req, Body, Post, Header } from '@nestjs/common';
import { ApiUseTags } from '@nestjs/swagger';
import { CommentService } from '../comment/comment.service';
import { CommentDto } from '../comment/comment.dto';
import { Comment } from '../comment/comment.entity';
import { CharacterService } from '../character/character.service';
import { CharactersDto } from '../character/characters.dto';
import { MovieParamDto } from './movies.param.dto';
import { CharacterQueryDto } from '../character/character.query.dto';
import { MoviesService } from './movies.service';
import { MovieDto } from './movies.dto';
import { UtilsService } from '../utils/utils.service';

@ApiUseTags('sw-api')
@Controller('movies')
export class MoviesController {
    constructor(
      private readonly movieService: MoviesService,
      private readonly commentService: CommentService,
      private readonly characterService: CharacterService,
      private readonly utilsService: UtilsService,
    ) {}

    @Get()
    async getMovies(): Promise<MovieDto[]> {
      return await this.movieService.getMovies();
    }

    @Get(':movieId/comments')
    async findAllMovieComments(@Param() param: MovieParamDto, @Query() query) {
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
    async saveComment(@Param() param: MovieParamDto, @Req() request: Request, @Body() body: CommentDto): Promise<Comment> {
        const movieId = param.movieId;
        const ipAddress = this.utilsService.getIpAddress(request);
        const {comment, commenter} = body;
        return await this.commentService.createComment(movieId, ipAddress, comment, commenter);
    }

    @Get(':movieId/characters')
    async getCharacters(@Param() params: MovieParamDto, @Query() query: CharacterQueryDto): Promise<CharactersDto> {
        const {name, gender, height, order, sort, filter} = query;
        const movieId: number = params.movieId;
        const movie: MovieDto = await this.movieService.getMovie(movieId);
        const characters = movie.characters;
        return await this.characterService.getCharacters(characters, name, gender, height, order, sort, filter);
    }
}
