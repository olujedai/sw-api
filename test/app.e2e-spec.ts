import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './../src/comment/comment.entity';
import { RequestService } from './../src/request/request.service';
import * as fs from 'fs';
import { MovieDto } from './../src/movies/dto/movies.dto';
import { Repository } from 'typeorm';
import { MoviesService } from './../src/movies/movies.service';
import { UtilsService } from './../src/utils/utils.service';
import { CommentService } from './../src/comment/comment.service';

const processedMoviesJson: Buffer = fs.readFileSync(`${__dirname}/../src/movies/static/processedMovies.json`);
const processedMovies: MovieDto[] = JSON.parse(processedMoviesJson.toString());
const processedMovieJson: Buffer = fs.readFileSync(`${__dirname}/../src/movies/static/processedMovie.json`);
const processedMovie: MovieDto = JSON.parse(processedMovieJson.toString());

describe('AppController (e2e)', () => {
  let app;
  let moduleFixture: TestingModule;
  let requestService: RequestService;
  let movieService: MoviesService;
  let utilsService: UtilsService;
  let repository: Repository<Comment>;

  beforeEach(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: String(process.env.DATABASE_HOST),
          port: Number(process.env.DATABASE_PORT),
          username: String(process.env.DATABASE_USER),
          password: String(process.env.DATABASE_PASSWORD),
          database: 'sw-api-test-db',
          entities: [Comment],
          dropSchema: true,
          synchronize: false,
          keepConnectionAlive: true,
        }),
        TypeOrmModule.forFeature([Comment]),
      ],
      providers: [
        RequestService,
        MoviesService,
        UtilsService,
        CommentService,
        {
          provide: getRepositoryToken(Comment),
          useClass: Repository,
        },
      ],
    }).compile();
    requestService = moduleFixture.get<RequestService>(RequestService);
    movieService = moduleFixture.get<MoviesService>(MoviesService);
    utilsService = moduleFixture.get<UtilsService>(UtilsService);
    repository = moduleFixture.get<Repository<Comment>>(getRepositoryToken(Comment));

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should be defined', () => {
    expect(requestService).toBeDefined();
    expect(movieService).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/is-alive')
      .expect(200)
      .expect('This server is up');
  });

  it('/movies (GET)', async () => {
    jest.spyOn(movieService, 'getMovies').mockResolvedValueOnce(processedMovies);
    const response: request.Response = await request(app.getHttpServer())
      .get('/movies')
      .expect(200);
    expect(response.body).toEqual(processedMovies);
  });

  it('gets movie comments', async () => {
    // todo: add data to the database before querying for it.
    jest.spyOn(movieService, 'getMovie').mockResolvedValueOnce(processedMovie);
    const response: request.Response = await request(app.getHttpServer())
      .get('/movies/1/comments')
      .expect(200);
  });

  it('creates a new movie comment', async () => {
    const data = {
      comment: 'Decent movie',
    };
    const mockIpAddress: string = '192.168.0.1';
    jest.spyOn(utilsService, 'getIpAddress').mockReturnValueOnce(mockIpAddress);
    jest.spyOn(movieService, 'getMovie').mockResolvedValueOnce(processedMovie);
    const response: request.Response = await request(app.getHttpServer())
      .post('/movies/3/comments')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(201);
    expect(response.body.comment).toEqual(data.comment);
    expect(response.body.ipAddress).toEqual(mockIpAddress);
    const movieComments = await repository.find({
      where: {
        movieId: 3,
      },
    });
    expect(movieComments).toHaveLength(1);
  });

  it('fails to create a new movie comment for a movie that doesnt exist', async () => {
    const data = {
      comment: 'Decent movie',
    };
    jest.spyOn(utilsService, 'getIpAddress').mockReturnValueOnce('192.168.0.1');
    jest.spyOn(movieService, 'getMovie').mockResolvedValueOnce(null);
    return request(app.getHttpServer())
      .post('/movies/1/comments')
      .send(data)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404);
  });

  it('fails to retrieve movie comments for a movie that doesnt exist', async () => {
    jest.spyOn(movieService, 'getMovie').mockResolvedValueOnce(null);
    const response: request.Response = await request(app.getHttpServer())
      .get('/movies/1/comments')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404);
  });

  it('fails to retrieve movie characters for a movie that doesnt exist', async () => {
    jest.spyOn(movieService, 'getMovie').mockResolvedValueOnce(null);
    const response: request.Response = await request(app.getHttpServer())
      .get('/movies/1/characters')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(404);
  });

  afterEach(async () => {
    moduleFixture.close();
  });

  afterAll(async () => {
    requestService.closeRedisInstance();
    await app.close();
  });
});
