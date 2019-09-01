import { Injectable } from '@nestjs/common';
import { MovieDto } from './movies.dto';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import { CommentService } from '../comment/comment.service';

@Injectable()
export class MoviesService {
    constructor(
        private readonly requestService: RequestService,
        private readonly utilsService: UtilsService,
        private readonly commentService: CommentService,
    ) {}

    async getMovies(): Promise<MovieDto[]> {
        const path: string = 'films';
        let movies = await this.requestService.getFromRedis(path);
        if (movies) {
            movies = JSON.parse(movies);
            return await this.processMovies(movies);
        }
        movies = await this.getMoviesFromRemote(path);
        movies = movies.map(movie => this.retrieveFields(movie));
        movies = await this.processMovies(movies);
        this.requestService.storeInRedis(path, JSON.stringify(movies));
        return movies;
    }

    async getMoviesFromRemote(path: string) {
        const resp: any = await this.requestService.fetch(path);
        return resp.results;
    }

    async processMovies(movieList: MovieDto[]): Promise<MovieDto[]> {
        const movieIds = movieList.map(movie => movie.id);
        const movieComments = movieIds.map(movieId => this.getCommentCount(movieId));
        const resolvedComments = await Promise.all(movieComments);
        movieList.forEach((movie, index) => {
            movie.commentCount = resolvedComments[index];
        });
        movieList.sort(this.utilsService.sortFunction('releaseDate'));
        return movieList;
    }

    async getMovie(movieId: number): Promise<MovieDto> {
        const path: string = `films/${movieId}`;
        let movie = await this.requestService.getFromRedis(path);
        if (movie) {
            movie = JSON.parse(movie);
            return movie;
        }
        const resp = await this.getMovieFromRemote(path);
        if (resp == null) {
            return resp;
        }
        movie = this.retrieveFields(resp);
        this.requestService.storeInRedis(path, JSON.stringify(movie));
        return movie;
    }

    async getMovieFromRemote(path: string) {
        const resp: any = await this.requestService.fetch(path);
        return resp;
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

    getCommentCount(movieId: number): Promise<number> {
        const filter = {
            movieId,
        };
        return this.commentService.count(filter);
    }
}
