import { Injectable } from '@nestjs/common';
import { MovieDto } from './movies.dto';
import { RequestService } from '../request/request.service';
import { sortFunction } from './movies.utils';

@Injectable()
export class MoviesService {
    constructor(private readonly requestService: RequestService) {}
    async getMovies(): Promise<MovieDto[]> {
        const path: string = 'films';
        const resp: any = await this.requestService.fetch(path);
        const movieList: MovieDto[] = resp.results.map(movie => {
            return {
                id: movie.episode_id,
                name: movie.title,
                releaseDate: new Date(movie.release_date),
                openingCrawl: movie.opening_crawl,
                commentCount: 0,
            };
        });
        movieList.sort(sortFunction('releaseDate'));

        return movieList;
    }
}
