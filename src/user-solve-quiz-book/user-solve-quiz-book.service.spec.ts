import { Test, TestingModule } from '@nestjs/testing';
import { UserSolveQuizBookService } from './user-solve-quiz-book.service';

describe('UserSolveQuizBookService', () => {
  let service: UserSolveQuizBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSolveQuizBookService],
    }).compile();

    service = module.get<UserSolveQuizBookService>(UserSolveQuizBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
