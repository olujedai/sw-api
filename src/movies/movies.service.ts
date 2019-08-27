import { Injectable } from '@nestjs/common';
import { MovieDto } from './movies.dto';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class MoviesService {
    constructor(
        private readonly requestService: RequestService,
        private readonly utilsService: UtilsService,
    ) {}
    async getMovies(): Promise<MovieDto[]> {
        const path: string = 'films';
        const resp: any = await this.requestService.fetch(path);
        const movieList: MovieDto[] = resp.results.map(movie => this.retrieveFields(movie));
        movieList.sort(this.utilsService.sortFunction('releaseDate'));

        return movieList;
    }

    async getMovie(movieId): Promise<MovieDto> {
        const path: string = `films/${movieId}`;
        const resp: any = await this.requestService.fetch(path);
        const movie = this.retrieveFields(resp);
        return movie;
    }

    retrieveFields(movie): MovieDto {
        return {
            id: movie.episode_id,
            name: movie.title,
            releaseDate: new Date(movie.release_date),
            openingCrawl: movie.opening_crawl,
            characters: movie.characters,
            commentCount: 0,
        };
    }
}
