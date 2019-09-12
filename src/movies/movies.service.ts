import { Injectable } from '@nestjs/common';
import { MovieDto } from './dto/movies.dto';
import { RemoteMovieObjectDto } from './dto/remoteMovie.dto';
import { RemoteMoviesObjectDto } from './dto/remoteMovies.dto';
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
        let movies: RemoteMovieObjectDto[] | MovieDto[] | string;
        movies = await this.requestService.getFromRedis(path);
        if (typeof(movies) === 'string') {
            const parsedMovies: MovieDto[] = JSON.parse(movies);
            return await this.getMovieCommentsAndSort(parsedMovies);
        }
        movies = await this.getMoviesFromRemote(path);
        movies = movies.map(movie => this.retrieveFields(movie));
        movies = await this.getMovieCommentsAndSort(movies);
        this.requestService.storeInRedis(path, JSON.stringify(movies));
        return movies;
    }

    async getMoviesFromRemote(path: string): Promise<RemoteMovieObjectDto[]> {
        /**
         * Request movies from a remote API
         * @param path: The path to be requested
         * @returns an array of movies
         */
        const resp: RemoteMoviesObjectDto = await this.requestService.fetch(path);
        return resp.results;
    }

    async getMovieCommentsAndSort(movieList: MovieDto[]): Promise<MovieDto[]> {
        /**
         * This method returns the associated comment count of a movie while sorting the movie list by release date
         * @param movieList list of movies
         * @returns processed movies
         */
        movieList = await this.getMovieComments(movieList);
        return this.sortMovieList(movieList);
    }

    async getMovieComments(movieList: MovieDto[]): Promise<MovieDto[]> {
        /**
         * This method returns the associated comment count of a movie while sorting the movie list by release date
         * @param movieList list of movies
         * @returns processed movies
         */
        const movieIds: number[] = movieList.map(movie => movie.id);
        const movieComments: Array<Promise<number>> = movieIds.map(movieId => this.getCommentCount(movieId));
        const resolvedComments: number[] = await Promise.all(movieComments);
        movieList.forEach((movie, index) => {
            movie.commentCount = resolvedComments[index];
        });
        return movieList;
    }

    sortMovieList(movieList: MovieDto[]): MovieDto[] {
        /**
         * This method takes in a list of movies of type MovieDto and returns the movies sorted by releaseDate
         * @param movieList list of movies
         * @returns list of movies sorted by releaseDate
         */
        return movieList.sort(this.utilsService.sortFunction('releaseDate'));
    }

    async getMovie(movieId: number): Promise<MovieDto|null> {
        /**
         * Request a movie from the cache or remote API and store the api response in the cache
         * @param movieId: The ID of the movie to be requested
         * @returns an movie object
         */
        const path: string = `films/${movieId}`;
        let movie: RemoteMovieObjectDto | MovieDto | string;
        movie = await this.requestService.getFromRedis(path);
        if (typeof(movie) === 'string') {
            return JSON.parse(movie);
        }
        const resp: RemoteMovieObjectDto | null = await this.getMovieFromRemote(path);
        if (typeof(resp) === 'undefined') {
            return resp;
        }
        movie = this.retrieveFields(resp);
        this.requestService.storeInRedis(path, JSON.stringify(movie));
        return movie;
    }

    async getMovieFromRemote(path: string): Promise<RemoteMovieObjectDto|null> {
        /**
         * Request a movie from a remote api.
         * @param path the path to the movie
         * @returns a MovieDto object or null
         */
        const resp: RemoteMovieObjectDto | null = await this.requestService.fetch(path);
        return resp;
    }

    retrieveFields(movie: RemoteMovieObjectDto): MovieDto {
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
        const filter: { movieId: number; } = {
            movieId,
        };
        return this.commentService.countMovieComments(filter);
    }
}
