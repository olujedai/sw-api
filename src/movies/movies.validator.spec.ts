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

const processedMovieJson: Buffer = fs.readFileSync(`${__dirname}/static/processedMovie.json`);
const processedMovie: MovieDto = JSON.parse(processedMovieJson.toString());

describe('Movie validation tests', () => {
    let movieService: MoviesService;
    let movieValidator: MovieValidator;

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
        }).compile();

        movieService = module.get<MoviesService>(MoviesService);
        movieValidator = module.get<MovieValidator>(MovieValidator);
    });

    it('should be defined', () => {
        expect(movieService).toBeDefined();
        expect(movieValidator).toBeDefined();
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
});
