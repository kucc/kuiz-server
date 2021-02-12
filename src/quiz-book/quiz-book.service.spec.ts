import { Test, TestingModule } from '@nestjs/testing';
import { QuizBookService } from './quiz-book.service';

describe('QuizBookService', () => {
  let service: QuizBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizBookService],
    }).compile();

    service = module.get<QuizBookService>(QuizBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
