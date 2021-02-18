import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { SolveQuizBookDTO } from './dto/user-solve-quiz-book-request.dto';
import { UserSolveQuizBookEntity } from '../entity/user-solve-quiz-book.entity';

@Injectable()
export class UserSolveQuizBookService {
  constructor(
    @InjectRepository(UserSolveQuizBookEntity)
    private readonly userSolveQuizBookRepository: Repository<UserSolveQuizBookEntity>,
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

    solvedQuizBook.liked = !solvedQuizBook.liked;
    await this.userSolveQuizBookRepository.save(solvedQuizBook);

    return solvedQuizBook.liked;
  }

  async isLastQuiz(quizOrder: number, quizCount: number): Promise<boolean> {
    if (quizOrder >= quizCount) {
      // TODO: relogic
      return true;
    }
    return false;
  }

  async solveQuizBook(
    quizBookId: number,
    userId: number,
    solvedQuizBookDTO: SolveQuizBookDTO,
    quizCount: number,
  ): Promise<UserSolveQuizBookEntity> {
    const solvedQuizBook = await this.findandCreatebyQBIdandUserId(
      quizBookId,
      userId,
    );
    solvedQuizBook.savedQuizId = solvedQuizBookDTO.quizId;
    const isLastQuiz = await this.isLastQuiz(
      solvedQuizBookDTO.quizOrder,
      quizCount,
    );
    if (isLastQuiz) {
      solvedQuizBook.completed = true;
    }

    await this.userSolveQuizBookRepository.save(solvedQuizBook);
    return solvedQuizBook;
  }
}
