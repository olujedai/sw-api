import { Injectable, NotFoundException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieDto } from './dto/movies.dto';

/**
 * Custom validator that checks if a movieId exists
 */
@Injectable()
export class MovieValidator {
    constructor(private readonly movieService: MoviesService) {}

    async validateMovieId(movieId: number): Promise<MovieDto> {
        const movie: MovieDto|null = await this.movieService.getMovie(movieId);
        if (!movie) {
            throw new NotFoundException(`Movie ID ${movieId} not found.`);
        }
        return movie;
    }
}
