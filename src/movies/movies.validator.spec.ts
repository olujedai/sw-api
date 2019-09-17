import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { MovieValidator } from './movies.validator';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/comment.entity';
import * as fs from 'fs';
import { MovieDto } from './dto/movies.dto';
import { RemoteMovieObjectDto } from './dto/remoteMovie.dto';
import { RemoteMoviesObjectDto } from './dto/remoteMovies.dto';

const processedMovieJson: Buffer = fs.readFileSync(`${__dirname}/static/processedMovie.json`);
const processedMovie: MovieDto = JSON.parse(processedMovieJson.toString());

describe('Movie service', () => {
    // let requestService: RequestService;
    // let commentService: CommentService;
    let movieService: MoviesService;
    let movieValidator: MovieValidator;
    // let utilsService: UtilsService;

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
            MovieValidator,
        ],
        // imports: [MovieValidator],
        }).compile();

        // requestService = module.get<RequestService>(RequestService);
        // commentService = module.get<CommentService>(CommentService);
        movieService = module.get<MoviesService>(MoviesService);
        movieValidator = module.get<MovieValidator>(MovieValidator);
        // utilsService = module.get<UtilsService>(UtilsService);
    });

    it('should be defined', () => {
        // expect(requestService).toBeDefined();
        // expect(commentService).toBeDefined();
        expect(movieService).toBeDefined();
        expect(movieValidator).toBeDefined();
        // expect(utilsService).toBeDefined();
    });

    it('should raise a Not found exception when a movie is not found', async () => {
        jest.spyOn(movieService, 'getMovie').mockResolvedValue(null);
        await expect(movieValidator.validateMovieId(1)).rejects.toThrow(NotFoundException);
        expect(1).toBe(1);
    });

    it('should return a movie', async () => {
        jest.spyOn(movieService, 'getMovie').mockResolvedValue(processedMovie);
        expect(await movieValidator.validateMovieId(1)).toBe(processedMovie);
    });

    // it('should return a list of raw movies', async () => {
    //     jest.spyOn(movieService, 'getMoviesFromRemote').mockResolvedValue(rawMovies.results);
    //     expect(await movieService.getMoviesFromRemote('films')).toBe(rawMovies.results);
    // });
});
