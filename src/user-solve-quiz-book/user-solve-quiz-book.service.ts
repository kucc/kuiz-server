import {
  EntityManager,
  getManager,
  Repository,
  TransactionManager,
} from 'typeorm';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SolveQuizBookDTO } from './dto/user-solve-quiz-book-request.dto';
import { UserSolveQuizBookEntity } from '../entity/user-solve-quiz-book.entity';
import { QuizBookEntity } from 'src/entity/quiz-book.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class UserSolveQuizBookService {
  constructor(
    @InjectRepository(UserSolveQuizBookEntity)
    private readonly userSolveQuizBookRepository: Repository<UserSolveQuizBookEntity>,
    @InjectRepository(QuizBookEntity)
    private readonly quizBookRepository: Repository<QuizBookEntity>,
    private readonly userService: UserService,
  ) {}

  async getUserSolveQuizBookResult(
    userId: number,
    quizBookId: number,
  ): Promise<UserSolveQuizBookEntity> {
    const userSolveQuizBook = await this.userSolveQuizBookRepository.findOne({
      where: {
        userId,
        quizBookId,
      },
    });
    if (!userSolveQuizBook) throw new NotFoundException('문제집을 풀어주세요');

    return userSolveQuizBook;
  }

  async findQuizBookByCategory(
    quizBookId: number,
    userId: number,
  ): Promise<UserSolveQuizBookEntity> {
    const solvedQuizBook = await this.userSolveQuizBookRepository.findOne({
      where: {
        quizBookId,
        userId,
      },
    });
    return solvedQuizBook;
  }

  async findandCreatebyQBIdandUserId(
    quizBookId: number,
    userId: number,
  ): Promise<UserSolveQuizBookEntity> {
    const solvedQuizBook = await this.userSolveQuizBookRepository.findOne({
      where: {
        quizBookId,
        userId,
      },
    });

    if (!solvedQuizBook) {
      const newUSQB = this.userSolveQuizBookRepository.create({
        quizBookId,
        userId,
      });
      await this.userSolveQuizBookRepository.save(newUSQB);
      return newUSQB;
    }
    return solvedQuizBook;
  }

  async toggleQuizBookLikes(
    quizBookId: number,
    userId: number,
    @TransactionManager() manager: EntityManager,
  ): Promise<boolean> {
    const solvedQuizBook = await this.findQuizBookByCategory(
      quizBookId,
      userId,
    );

    if (!solvedQuizBook || !solvedQuizBook.completed) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: '문제집을 다 풀어야 좋아요를 누를 수 있습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    solvedQuizBook.liked = !solvedQuizBook.liked;
    await manager.save(solvedQuizBook);
    return solvedQuizBook.liked;
  }

  async checkIsLastQuiz(
    quizBookId: number,
    solvedQuizId: number,
  ): Promise<boolean> {
    const quizBook = await this.quizBookRepository.findOne({ id: quizBookId });

    if (solvedQuizId === quizBook.lastQuizId) {
      return true;
    }

    return false;
  }

  async solveQuizBook(
    quizBookId: number,
    userId: number,
    solvedQuizBookDTO: SolveQuizBookDTO,
  ): Promise<UserSolveQuizBookEntity> {
    const solvedQuizBook = await this.findandCreatebyQBIdandUserId(
      quizBookId,
      userId,
    );

    const quizBook = await this.quizBookRepository.findOne({ id: quizBookId });

    const isLastQuiz = await this.checkIsLastQuiz(
      solvedQuizBook.quizBookId,
      solvedQuizBookDTO.quizId,
    );

    if (solvedQuizBook.savedQuizId < solvedQuizBookDTO.quizId) {
      if (solvedQuizBookDTO.isCorrect) {
        await this.userService.increaseUserPoint(userId, 30);
        solvedQuizBook.savedCorrectCount += 1;
      }
      if (isLastQuiz) quizBook.solvedCount += 1;
      solvedQuizBook.updatedAt = new Date();
      solvedQuizBook.savedQuizId = solvedQuizBookDTO.quizId;
    }

    if (isLastQuiz) {
      solvedQuizBook.completed = true;
    }

    await this.userSolveQuizBookRepository.save(solvedQuizBook);
    await this.quizBookRepository.save(quizBook);
    return solvedQuizBook;
  }
}
