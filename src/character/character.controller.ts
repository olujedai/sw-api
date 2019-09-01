import { Controller, Get, Query, Param } from '@nestjs/common';
import { CharacterService } from './character.service';
import { MoviesService } from '../movies/movies.service';
import { MovieDto } from '../movies/movies.dto';
import { CharactersDto } from './characters.dto';
import { CharacterParamDto } from './character.param.dto';
import { CharacterQueryDto } from './character.query.dto';
import { ApiUseTags } from '@nestjs/swagger';

@ApiUseTags('sw-api')
@Controller('character')
export class CharacterController {
    constructor(
        private readonly characterService: CharacterService,
        // private readonly moviesService: MoviesService,
    ) {}

    // @Get(':movieId')
    // async getCharacters(@Param() params: CharacterParamDto, @Query() query: CharacterQueryDto): Promise<CharactersDto> {
    //     const {name, gender, height, order, sort, filter} = query;
    //     const movieId = params.movieId;
    //     const movie: MovieDto = await this.moviesService.getMovie(movieId);
    //     const characters = movie.characters;
    //     return await this.characterService.getCharacters(characters, name, gender, height, order, sort, filter);
    // }
}
