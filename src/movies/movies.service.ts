import { Injectable } from '@nestjs/common';
import { MovieDto } from './dto/movies.dto';
import { ApiResponseDto } from './dto/apiResponse.dto';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import { CommentService } from '../comment/comment.service';

/*
Provides methods that implement logic for responding to movie related requests by interacting with the cache, database and remote url
*/

@Injectable()
export class MoviesService {
    constructor(
        private readonly requestService: RequestService,
        private readonly utilsService: UtilsService,
        private readonly commentService: CommentService,
    ) {}

    async getMovies(): Promise<MovieDto[]> {
        /**
         * This provides requests for movies from the cache or external api and returns processed movies to the caller.
         * @returns an array of MovieDto objects
         */
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

    async getMoviesFromRemote(path: string): Promise<ApiResponseDto[]> {
        /**
         * Request movies from a remote API
         * @param path: The path to be requested
         * @returns an array of movies
         */
        const resp: any = await this.requestService.fetch(path);
        return resp.results;
    }

    async processMovies(movieList: MovieDto[]): Promise<MovieDto[]> {
        /**
         * This method returns the associated comment count of a movie while sorting the movie list by release date
         * @param movieList list of movies
         * @returns processed movies
         */
        const movieIds = movieList.map(movie => movie.id);
        const movieComments = movieIds.map(movieId => this.getCommentCount(movieId));
        const resolvedComments = await Promise.all(movieComments);
        movieList.forEach((movie, index) => {
            movie.commentCount = resolvedComments[index];
        });
        movieList.sort(this.utilsService.sortFunction('releaseDate'));
        return movieList;
    }

    async getMovie(movieId: number): Promise<MovieDto|null> {
        /**
         * Request a movie from the cache or remote API and store the api response in the cache
         * @param movieId: The ID of the movie to be requested
         * @returns an movie object
         */
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
        /**
         * Request a movie from a remote api.
         * @param path the path to the movie
         * @returns a MovieDto object or null
         */
        const resp = await this.requestService.fetch(path);
        return resp;
    }

    retrieveFields(movie: ApiResponseDto): MovieDto {
        /**
         * Transform a movie object to the format used in this application.
         * @param movie the movie object from a remote api
         * @returns a MovieDto object
         */
        return {
            id: movie.episode_id,
            name: movie.title,
            releaseDate: movie.release_date,
            openingCrawl: movie.opening_crawl,
            characters: movie.characters,
            commentCount: 0,
        };
    }

    getCommentCount(movieId: number): Promise<number> {
        /**
         * Method for obtaining the number of comments a movie has
         * @param movieId: The ID of the movie
         * @returns a number indicating the number of comments a movie has
         */
        const filter = {
            movieId,
        };
        return this.commentService.count(filter);
    }
}
