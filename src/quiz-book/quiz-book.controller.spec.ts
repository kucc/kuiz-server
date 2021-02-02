import { Test, TestingModule } from '@nestjs/testing';
import { QuizBookController } from './quiz-book.controller';

describe('QuizBookController', () => {
  let controller: QuizBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizBookController],
    }).compile();

    controller = module.get<QuizBookController>(QuizBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
