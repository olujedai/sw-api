import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/comment.entity';
import * as fs from 'fs';

const processedMoviesJson = fs.readFileSync(`${__dirname}/static/processedMovies.json`);
const processedMovies = JSON.parse(processedMoviesJson.toString());

const rawMoviesJson = fs.readFileSync(`${__dirname}/static/raw.movies.json`);
const rawMovies = JSON.parse(rawMoviesJson.toString());

const rawMovieJson = fs.readFileSync(`${__dirname}/static/raw.movie.json`);
const rawMovie = JSON.parse(rawMovieJson.toString());

describe('Movie service', () => {
    let requestService: RequestService;
    let commentService: CommentService;
    let movieService: MoviesService;
    let utilsService: UtilsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            RequestService,
            CommentService,
            {
                provide: getRepositoryToken(Comment),
                useValue: {name: ''},
            },
            MoviesService,
            UtilsService,
        ],
        }).compile();

        requestService = module.get<RequestService>(RequestService);
        commentService = module.get<CommentService>(CommentService);
        movieService = module.get<MoviesService>(MoviesService);
        utilsService = module.get<UtilsService>(UtilsService);
    });

    it('should be defined', () => {
        expect(requestService).toBeDefined();
        expect(commentService).toBeDefined();
        expect(movieService).toBeDefined();
        expect(utilsService).toBeDefined();
    });

    it('should return a list of processed movies', async () => {
        jest.spyOn(movieService, 'getMovies').mockResolvedValue(processedMovies);
        expect(await movieService.getMovies()).toBe(processedMovies);
    });

    it('should return a list of raw movies', async () => {
        jest.spyOn(movieService, 'getMoviesFromRemote').mockResolvedValue(rawMovies.results);
        expect(await movieService.getMoviesFromRemote('films')).toBe(rawMovies.results);
    });

    it('should return a single movie', async () => {
        jest.spyOn(movieService, 'getMovieFromRemote').mockResolvedValue(rawMovie);
        expect(await movieService.getMovieFromRemote('films/1/')).toBe(rawMovie);
    });

    it('should retrieve the required fields from an external API', async () => {
        const movie = movieService.retrieveFields(rawMovie);
        expect(movie).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                releaseDate: expect.any(String),
                openingCrawl: expect.any(String),
                characters: expect.any(Array),
                commentCount: expect.any(Number),
            }),
        );
    });

    it('takes in raw movies and returns the procesed result.', async () => {
        jest.spyOn(movieService, 'getCommentCount').mockResolvedValue(0);
        let movieArray = rawMovies.results.map(movie => movieService.retrieveFields(movie));
        movieArray = await movieService.getMovieCommentsAndSort(movieArray);
        expect(movieArray).toEqual(processedMovies);
    });
});
