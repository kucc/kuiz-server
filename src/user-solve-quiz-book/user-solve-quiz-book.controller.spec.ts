import { Test, TestingModule } from '@nestjs/testing';
import { UserSolveQuizBookController } from './user-solve-quiz-book.controller';

describe('UserSolveQuizBookController', () => {
  let controller: UserSolveQuizBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSolveQuizBookController],
    }).compile();

    controller = module.get<UserSolveQuizBookController>(UserSolveQuizBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
