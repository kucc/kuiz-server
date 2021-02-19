import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { QUIZBOOKS_PER_PAGE } from '../../constants';
import { QuizBookEntity } from '../entity/quiz-book.entity';
import { CreateQuizBookDTO, EditQuizBookDTO } from './dto/quizbook-request.dto';
import { UserSolveQuizBookService } from '../user-solve-quiz-book/user-solve-quiz-book.service';
import { SolveQuizBookDTO } from '../user-solve-quiz-book/dto/user-solve-quiz-book-request.dto';
import { SolveResultQuizBookDTO } from '../user-solve-quiz-book/dto/user-solve-quiz-book-response.dto';
import { UserSolveQuizBookEntity } from 'src/entity/user-solve-quiz-book.entity';

@Injectable()
export class QuizBookService {
  constructor(
    @InjectRepository(QuizBookEntity)
    private readonly quizBookRepository: Repository<QuizBookEntity>,

    @InjectRepository(UserSolveQuizBookEntity)
    private readonly userSolveQuizBookRespository: Repository<UserSolveQuizBookEntity>,

    private readonly userSolveQuizBookService: UserSolveQuizBookService,
    private readonly userSerive: UserService,
  ) {}

  async findQuizBookbyId(id: number): Promise<QuizBookEntity> {
    const quizBook = await this.quizBookRepository.findOne({ id });

    if (!quizBook) {
      throw new NotFoundException('존재하지 않는 문제집입니다.');
    }

    return quizBook;
  }

  async findAllQuizBookByCategory(
    categoryId: number,
    page: number,
  ): Promise<[QuizBookEntity[], number]> {
    const take = QUIZBOOKS_PER_PAGE;
    const skip = (page - 1) * QUIZBOOKS_PER_PAGE;

    const [data, count] = await this.quizBookRepository.findAndCount({
      where: {
        categoryId,
      },
      take,
      skip,
    });

    if (!data.length) {
      throw new NotFoundException('페이지가 존재하지 않습니다.');
    }
    return [data, count];
  }

  async checkAuthorization(ownerId: number, userId: number): Promise<boolean> {
    if (ownerId !== userId) {
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
    const quizBook = await this.findQuizBookbyId(quizBookId);
    await this.checkAuthorization(quizBook.ownerId, userId);

    await this.quizBookRepository.delete({ id: quizBookId });
    return { result: true };
  }

  async editQuizBook(
    quizBookId: number,
    quizbookDTO: EditQuizBookDTO,
    userId: number,
  ): Promise<QuizBookEntity> {
    const quizBook = await this.findQuizBookbyId(quizBookId);
    await this.checkAuthorization(quizBook.ownerId, userId);

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

  async increaseQuizCount(quizBookId: number) {
    await this.quizBookRepository
      .query('UPDATE quizBook SET quizCount = quizCount + 1 where id = ?', [
        quizBookId,
      ])
      .catch(() => {
        throw new BadRequestException('잘못된 요청입니다.');
      });
  }

  async decreaseQuizCount(quizBookId: number) {
    await this.quizBookRepository
      .query('UPDATE quizBook SET quizCount = quizCount - 1 where id = ?', [
        quizBookId,
      ])
      .catch(() => {
        throw new BadRequestException('잘못된 요청입니다.');
      });
  }

  async solveQuizBook(
    quizBookId: number,
    userId: number,
    solveQuizBookDTO: SolveQuizBookDTO,
  ): Promise<SolveResultQuizBookDTO> {
    const quizBook = await this.findQuizBookbyId(quizBookId);

    const solvedQuizBook = await this.userSolveQuizBookService.solveQuizBook(
      quizBookId,
      userId,
      solveQuizBookDTO,
      quizBook.quizCount,
    );

    if (solveQuizBookDTO.isCorrect) {
      await this.userSerive.increaseUserPoint(userId);
    }

    return new SolveResultQuizBookDTO(solvedQuizBook);
  }

  async getQuizBookOwnedByUSer(userId: number, isDone: boolean) {
    const quizBookList = await this.quizBookRepository.find({
      ownerId: userId,
      completed: isDone,
    });

    return quizBookList;
  }

  async getQuizBookSolvedByUser(userId: number, isDone: boolean) {
    const quizBookList = await this.userSolveQuizBookRespository.find({
      relations: ['quizBook'],
      where: {
        userId,
        completed: isDone,
      },
    });

    return quizBookList;
  }
}
