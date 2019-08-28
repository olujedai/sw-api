import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';

const testComment: Comment =  {
    movieId: 1,
    ipAddress: '154.113.66.78',
    comment: 'Good movie',
    commenter: 'Anon',
    id: 2,
    dateCreated: new Date('2019-08-27T19:56:22.485Z'),
};
const findAndCountResponse: [Comment[], number] = [
    [testComment],
    1,
];

describe('CommentService', () => {
  let service: CommentService;
  let repo: Repository<Comment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          CommentService,
          {
            // how you provide the injection token in a test instance
            provide: getRepositoryToken(Comment),
            // as a class value, Repository needs no generics
            useClass: Repository,
        },
    ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    repo = module.get<Repository<Comment>>(getRepositoryToken(Comment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return for findAll', async () => {
    const skip = 1;
    const size = 1;
    const filter = {
        movieId: 1,
    };
    jest.spyOn(repo, 'findAndCount').mockResolvedValueOnce(findAndCountResponse);
    expect(await service.findAll(size, skip, filter)).toBe(findAndCountResponse);
  });

  it('should return for count', async () => {
    const filter = {
        movieId: 1,
    };
    jest.spyOn(repo, 'count').mockResolvedValueOnce([testComment].length);
    expect(await service.count(filter)).toBe(1);
  });

  it('should create a comment and return created comment', async () => {
    const movieId = testComment.movieId;
    const ipAddress = testComment.ipAddress;
    const comment = testComment.comment;
    const commenter = testComment.commenter;
    jest.spyOn(service, 'createComment').mockResolvedValueOnce(testComment);
    expect(await service.createComment(movieId, ipAddress, comment, commenter)).toBe(testComment);
  });
});
