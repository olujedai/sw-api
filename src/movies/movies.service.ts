import { Injectable } from '@nestjs/common';
import { MovieDto } from './movies.dto';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import { CommentService } from '../comment/comment.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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
        movies = await this.processMovies(movies);
        return movies;
    }

    async getMoviesFromRemote(path) {
        const resp: any = await this.requestService.fetch(path);
        const movieList: MovieDto[] = resp.results.map(movie => this.retrieveFields(movie));
        const movies = await this.processMovies(movieList);
        this.requestService.storeInRedis(path, JSON.stringify(movies));
        return movies;
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

    async getMovie(movieId): Promise<MovieDto> {
        const path: string = `films/${movieId}`;
        let movie = await this.requestService.getFromRedis(path);
        if (movie) {
            movie = JSON.parse(movie);
            movie.commentCount = await this.getCommentCount(movieId);
            return movie;
        }
        movie = this.getMovieFromRemote(path);
        movie.commentCount = await this.getCommentCount(movieId);
        return movie;
    }

    async getMovieFromRemote(path) {
        const resp: any = await this.requestService.fetch(path);
        const movie = this.retrieveFields(resp);
        this.requestService.storeInRedis(path, JSON.stringify(movie));
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

    getCommentCount(movieId): Promise<number> {
        const filter = {
            movieId,
        };
        return this.commentService.count(filter);
    }
}
