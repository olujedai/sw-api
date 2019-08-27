import { Controller, Get, Query, Param } from '@nestjs/common';
import { CharacterService } from './character.service';
import { MoviesService } from '../movies/movies.service';
import { MovieDto } from '../movies/movies.dto';
import { CharactersDto } from './characters.dto';

@Controller('character')
export class CharacterController {
    constructor(
        private readonly characterService: CharacterService,
        private readonly moviesService: MoviesService,
    ) {}

    @Get(':movieId')
    async getCharacters(@Param() params, @Query('order') order: string ): Promise<CharactersDto> {
        const movie: MovieDto = await this.moviesService.getMovie(params.movieId);
        const characters = movie.characters;
        return await this.characterService.getCharacters(characters);
    }
}
