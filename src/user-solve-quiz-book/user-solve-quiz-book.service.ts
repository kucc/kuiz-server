import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
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
  ): Promise<boolean> {
    const solvedQuizBook = await this.findandCreatebyQBIdandUserId(
      quizBookId,
      userId,
    );

    if (!solvedQuizBook.completed) {
      throw new BadRequestException('user does not solve quizbook');
    }

    solvedQuizBook.liked = !solvedQuizBook.liked;
    await this.userSolveQuizBookRepository.save(solvedQuizBook);

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

    if (solvedQuizBook.savedQuizId < solvedQuizBookDTO.quizId) {
      if (solvedQuizBookDTO.isCorrect) {
        await this.userService.increaseUserPoint(userId, 30);
        solvedQuizBook.savedCorrectCount += 1;
      }
      solvedQuizBook.savedQuizId = solvedQuizBookDTO.quizId;
    }

    const isLastQuiz = await this.checkIsLastQuiz(
      solvedQuizBook.quizBookId,
      solvedQuizBookDTO.quizId,
    );

    if (isLastQuiz) {
      solvedQuizBook.completed = true;
    }

    await this.userSolveQuizBookRepository.save(solvedQuizBook);
    return solvedQuizBook;
  }
}
