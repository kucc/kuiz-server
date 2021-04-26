import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizEntity } from 'src/entity/quiz.entity';
import { SolvingQuizBookWithQuizResponseDTO } from 'src/quiz-book/dto/quizbook-response.dto';
import { QuizBookService } from 'src/quiz-book/quiz-book.service';
import { Repository } from 'typeorm';
import CreateQuizRequestDTO from './dto/create-quiz-request.dto';
import UpdateQuizRequestDTO from './dto/update-quiz-request.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity)
    public readonly QuizRepository: Repository<QuizEntity>,
    public readonly quizBookService: QuizBookService,
  ) {}

  async findById(id: number): Promise<QuizEntity> {
    const quiz = await this.QuizRepository.findOne(id);
    if (!quiz) {
      throw new NotFoundException('존재하지 않는 문제입니다.');
    }
    return quiz;
  }

  async getAllQuizByQuizBookId(quizBookId: number): Promise<QuizEntity[]> {
    const quizList = await this.QuizRepository.find({ quizBookId });
    if (!quizList) {
      throw new NotFoundException('문제가 존재하지 않습니다.');
    }

    return quizList;
  }

  async getUnsolvedQuizByQuizBookId(
    quizBookId: number,
    userId: number,
  ): Promise<QuizEntity[]> {
    const unsolvedQuizList = await this.QuizRepository.query(
      `SELECT * FROM quiz 
       WHERE quizBookId = ? 
       AND id > ( SELECT savedQuizId FROM userSolveQuizBook WHERE userId = ? AND quizBookId = ?);`,
      [quizBookId, userId, quizBookId],
    );

    return unsolvedQuizList;
  }

  async findByIdAndCheckOwner(id: number, userId: number): Promise<QuizEntity> {
    const quiz = await this.findById(id);
    const quizBook = await this.quizBookService.findQuizBookbyId(
      quiz.quizBookId,
    );
    await this.quizBookService.checkAuthorization(quizBook.ownerId, userId);

    return quiz;
  }

  async createQuiz(quiz: CreateQuizRequestDTO): Promise<QuizEntity> {
    const newQuiz = this.QuizRepository.create(quiz);
    await this.QuizRepository.save(newQuiz).catch(() => {
      throw new BadRequestException(
        '잘못된 요청입니다. 필수 영역을 모두 입력해주세요.',
      );
    });
    await this.quizBookService.increaseQuizCount(newQuiz.quizBookId);

    return newQuiz;
  }

  async updateQuiz(
    userId: number,
    quiz: QuizEntity,
    requestDTO: UpdateQuizRequestDTO,
  ): Promise<QuizEntity> {
    const quizBook = await this.quizBookService.findQuizBookbyId(
      quiz.quizBookId,
    );
    await this.quizBookService.checkAuthorization(quizBook.ownerId, userId);

    await this.QuizRepository.update(quiz, { ...requestDTO });
    return await this.QuizRepository.findOne(quiz.id);
  }

  async deleteQuiz(quizId: number): Promise<{ result: boolean }> {
    const quiz = await this.findById(quizId);

    await this.QuizRepository.delete(quiz).catch(() => {
      throw new BadRequestException('잘못된 요청입니다.');
    });
    await this.quizBookService.decreaseQuizCount(quiz.quizBookId);

    return { result: true };
  }

  async getSolvingQuizBookwithQuiz(
    quizBookId: number,
    userId: number,
  ): Promise<SolvingQuizBookWithQuizResponseDTO> {
    const quizBook = await this.quizBookService.getSolvingQuizBook(
      quizBookId,
      userId,
    );

    if (quizBook.savedCorrectCount == null || quizBook.allSolved) {
      const quizList = await this.QuizRepository.find({ quizBookId });
      quizBook.quiz = quizList;
    } else {
      const quizList = await this.getUnsolvedQuizByQuizBookId(
        quizBookId,
        userId,
      );
      quizBook.quiz = quizList;
    }

    return quizBook;
  }
}
