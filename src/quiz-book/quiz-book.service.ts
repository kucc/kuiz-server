import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { QuizBookEntity } from '../entity/quiz-book.entity';
import { CreateQuizBookDTO, EditQuizBookDTO } from './dto/quizbook-request.dto';
import { UserSolveQuizBookService } from '../user-solve-quiz-book/user-solve-quiz-book.service';

@Injectable()
export class QuizBookService {
  constructor(
    @InjectRepository(QuizBookEntity)
    private readonly quizBookRepository: Repository<QuizBookEntity>,
    private readonly userSolveQuizBookService: UserSolveQuizBookService,
  ) {}

  async findQuizBookbyId(id: number): Promise<QuizBookEntity> {
    const quizBook = await this.quizBookRepository.findOne({ id });

    if (!quizBook) {
      throw new NotFoundException('존재하지 않는 문제집입니다.');
    }

    return quizBook;
  }

  async checkAuthorization(
    quizBookId: number,
    userId: number,
  ): Promise<boolean> {
    if (quizBookId !== userId) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    return true;
  }

  async createQuizBook(
    userId: number,
    userName: string,
    quizbookDTO: CreateQuizBookDTO,
  ): Promise<QuizBookEntity> {
    quizbookDTO.ownerId = userId;
    quizbookDTO.ownerName = userName;

    const quizBook = this.quizBookRepository.create(quizbookDTO);
    await this.quizBookRepository.save(quizBook);

    return quizBook;
  }

  async deleteQuizBook(
    quizBookId: number,
    userId: number,
  ): Promise<{ result: boolean }> {
    await this.findQuizBookbyId(quizBookId);
    await this.checkAuthorization(quizBookId, userId);

    await this.quizBookRepository.delete({ id: quizBookId });

    return { result: true };
  }

  async editQuizBook(
    quizBookId: number,
    quizbookDTO: EditQuizBookDTO,
    userId: number,
  ): Promise<QuizBookEntity> {
    const quizBook = await this.findQuizBookbyId(quizBookId);

    await this.checkAuthorization(quizBookId, userId);

    const editedQuizBook = this.quizBookRepository.merge(quizBook, quizbookDTO);
    await this.quizBookRepository.save(editedQuizBook);

    return editedQuizBook;
  }

  async updateQuizBookLikes(
    quizBookId: number,
    userId: number,
  ): Promise<QuizBookEntity> {
    const quizBook = await this.findQuizBookbyId(quizBookId);
    const isUserLiked = await this.userSolveQuizBookService.toggleQuizBookLikes(
      quizBookId,
      userId,
    );

    if (isUserLiked) {
      quizBook.likedCount += 1;
    } else {
      quizBook.likedCount -= 1;
    }

    return await this.quizBookRepository.save(quizBook);
  }

  async solveQuiz(quizId: number, userId: number) {
    // TODO
  }
}
