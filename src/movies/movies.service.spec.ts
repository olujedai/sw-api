import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoviesService } from './movies.service';
import { RequestService } from '../request/request.service';
import { UtilsService } from '../utils/utils.service';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/comment.entity';
import * as fs from 'fs';

const moviesJson = fs.readFileSync(`${__dirname}/static/movies.json`);
const movies = JSON.parse(moviesJson.toString());

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

    it('should return a list of movies', async () => {
        jest.spyOn(movieService, 'getMovies').mockResolvedValueOnce(movies);
        expect(await movieService.getMovies()).toBe(movies);
    });

});
