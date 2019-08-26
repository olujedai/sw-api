import { Controller, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto } from './movies.dto';

@Controller('movies')
export class MoviesController {
    constructor(private readonly movieService: MoviesService) {}

    @Get()
    async getMovies(): Promise<MovieDto[]> {
      return await this.movieService.getMovies();
    }
}
