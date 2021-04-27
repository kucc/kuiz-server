import { getManager, Repository } from 'typeorm';
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
import {
  LikeQuizBookResponseDTO,
  QuizBookwithLikedResponseDTO,
  QuizBookWithSolvingQuizResponseDTO,
} from './dto/quizbook-response.dto';

@Injectable()
export class QuizBookService {
  constructor(
    @InjectRepository(QuizBookEntity)
    private readonly quizBookRepository: Repository<QuizBookEntity>,

    @InjectRepository(UserSolveQuizBookEntity)
    private readonly userSolveQuizBookRespository: Repository<UserSolveQuizBookEntity>,

    private readonly userSolveQuizBookService: UserSolveQuizBookService,
    private readonly userService: UserService,
  ) {}

  async getQuizBookListByKeyword(
    userId: number,
    categoryId: number,
    page: number,
    keyword: string,
    isSortByDate: boolean,
  ): Promise<QuizBookwithLikedResponseDTO[]> {
    const take = QUIZBOOKS_PER_PAGE;
    const skip = (page - 1) * QUIZBOOKS_PER_PAGE;
    const orderOption = isSortByDate ? 'qb.id' : 'qb.likedCount';

    const quizbookList = await this.quizBookRepository.query(
      `SELECT qb.*, usq.liked,
      CASE WHEN usq.id IS NULL THEN false END
      FROM quizBook qb LEFT JOIN userSolveQuizBook usq 
      ON qb.id=usq.quizBookId AND usq.userId=?
      WHERE qb.completed=1 AND qb.categoryId = ? AND qb.title LIKE '%${keyword}%' 
      ORDER BY ${orderOption} DESC LIMIT ? OFFSET ?`,
      [userId, categoryId, take, skip],
    );

    if (page != 1 && !quizbookList.length) {
      throw new NotFoundException('페이지가 존재하지 않습니다.');
    }

    const dto = quizbookList.map((entity) => {
      return new QuizBookwithLikedResponseDTO(entity);
    });

    return dto;
  }

  async getUnSolvedQuizBookListByKeyword(
    userId: number,
    categoryId: number,
    page: number,
    keyword: string,
    isSortByDate: boolean,
  ) {
    const take = QUIZBOOKS_PER_PAGE;
    const skip = (page - 1) * QUIZBOOKS_PER_PAGE;
    const orderOption = isSortByDate ? 'id' : 'likedCount';

    const quizbookList = await this.quizBookRepository.query(
      `SELECT * FROM quizBook WHERE categoryId = ? AND completed = 1 AND title LIKE '%${keyword}%'
      AND id NOT IN ( SELECT quizBookId FROM userSolveQuizBook WHERE userId = ?)
       ORDER BY ${orderOption} DESC LIMIT ? OFFSET ?;
      `,
      [categoryId, userId, take, skip],
    );

    if (page != 1 && !quizbookList.length) {
      throw new NotFoundException('페이지가 존재하지 않습니다.');
    }

    const dto = quizbookList.map((entity) => {
      return new QuizBookwithLikedResponseDTO(entity);
    });

    return dto;
  }

  async findQuizBookbyId(id: number): Promise<QuizBookEntity> {
    const quizBook = await this.quizBookRepository.findOne({ id });

    if (!quizBook) {
      throw new NotFoundException('존재하지 않는 문제집입니다.');
    }

    return quizBook;
  }

  async findAllQuizBookByCategory(
    userId: number,
    categoryId: number,
    page: number,
    isSortByDate: boolean,
  ) {
    const take = QUIZBOOKS_PER_PAGE;
    const skip = (page - 1) * QUIZBOOKS_PER_PAGE;
    const orderOption = isSortByDate ? 'qb.id' : 'qb.likedCount';
    const quizbooks = await this.quizBookRepository.query(
      `SELECT qb.*, usq.liked, 
      CASE WHEN usq.id IS NULL THEN false END 
      FROM quizBook qb LEFT JOIN userSolveQuizBook usq 
      ON qb.id=usq.quizBookId AND usq.userId=? 
      WHERE qb.completed=1 AND categoryId = ? ORDER BY ${orderOption} DESC 
      LIMIT ? OFFSET ?`,
      [userId, categoryId, take, skip],
    );

    if (!quizbooks.length) {
      throw new NotFoundException('페이지가 존재하지 않습니다.');
    }

    const dtos = quizbooks.map((entity) => {
      return new QuizBookwithLikedResponseDTO(entity);
    });
    return dtos;
  }

  async getQuizBookSolveResult(
    userId: number,
    quizBookId: number,
  ): Promise<UserSolveQuizBookEntity> {
    const quizBookSolveResult = await this.userSolveQuizBookService.getUserSolveQuizBookResult(
      userId,
      quizBookId,
    );

    return quizBookSolveResult;
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

    await this.userService.increaseUserPoint(userId, 100);

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

  //좋아요 수 변경
  async updateQuizBookLikes(quizBookId: number, userId: number) {
    return await getManager()
      .transaction(async (transactionEntityManager) => {
        const quizBook = await this.findQuizBookbyId(quizBookId);
        const isUserLiked = await this.userSolveQuizBookService.toggleQuizBookLikes(
          quizBookId,
          userId,
          transactionEntityManager,
        );

        if (isUserLiked) {
          quizBook.likedCount += 1;
        } else {
          quizBook.likedCount -= 1;
        }
        const updatedQuizBook = await transactionEntityManager.save(quizBook);

        const result = new QuizBookwithLikedResponseDTO(updatedQuizBook);
        result.liked = isUserLiked;
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  async getQuizBookLikes(quizBookId: number, userId: number) {
    const quizBook = await this.findQuizBookbyId(quizBookId);
    const isUserLike = await this.userSolveQuizBookRespository.findOne({
      where: {
        quizBookId,
        userId,
      },
    });

    if (!isUserLike) {
      return new LikeQuizBookResponseDTO(
        +quizBookId,
        quizBook.likedCount,
        false,
      );
    }
    return new LikeQuizBookResponseDTO(
      +quizBookId,
      quizBook.likedCount,
      isUserLike.liked,
    );
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

    await this.syncQuizBookUpdatedAt(quizBookId);
  }

  async solveQuizBook(
    quizBookId: number,
    userId: number,
    solveQuizBookDTO: SolveQuizBookDTO,
  ): Promise<SolveResultQuizBookDTO> {
    const solvedQuizBookResult = await this.userSolveQuizBookService.solveQuizBook(
      quizBookId,
      userId,
      solveQuizBookDTO,
    );

    return solvedQuizBookResult;
  }

  async getQuizBookOwnedByUSer(userId: number, isDone: boolean) {
    const quizBookList = await this.quizBookRepository.query(
      `SELECT * FROM quizBook 
      WHERE ownerId= ? AND completed= ?`,
      [userId, isDone],
    );
    const dto = quizBookList.map((entity) => {
      return new QuizBookwithLikedResponseDTO(entity);
    });

    return dto;
  }

  async getQuizBookSolvedByUser(userId: number, isDone: boolean) {
    const userSolveQuizBookList = await this.quizBookRepository.query(
      `SELECT qb.*, usq.liked 
      FROM quizBook AS qb LEFT JOIN userSolveQuizBook usq 
      ON qb.id=usq.quizBookId
      WHERE usq.userId = ? AND usq.completed = ?`,
      [userId, isDone],
    );

    const quizBookList = userSolveQuizBookList.map((entity) => {
      return new QuizBookwithLikedResponseDTO(entity);
    });

    return quizBookList;
  }

  async getUnsolvedQuizBookByUser(
    categoryId: number,
    userId: number,
    page: number,
    isSortByDate: boolean,
  ) {
    const take = QUIZBOOKS_PER_PAGE;
    const skip = (page - 1) * QUIZBOOKS_PER_PAGE;
    const orderOption = isSortByDate ? 'id' : 'likedCount';

    const unsolvedQuizBookList = await this.userSolveQuizBookRespository.query(
      `SELECT * FROM quizBook WHERE categoryId = ? AND completed=1 AND id NOT IN 
        ( SELECT quizBookId FROM userSolveQuizBook WHERE userId = ? ) 
        ORDER BY ${orderOption} DESC LIMIT ? OFFSET ?;
      `,
      [categoryId, userId, take, skip],
    );

    if (!unsolvedQuizBookList.length) {
      throw new NotFoundException('페이지가 존재하지 않습니다.');
    }
    const dto = unsolvedQuizBookList.map((entity) => {
      return new QuizBookwithLikedResponseDTO(entity);
    });

    return dto;
  }

  async getAuthorizedQuizBook(
    quizBookId: number,
    userId: number,
  ): Promise<QuizBookEntity> {
    const quizBook = await this.findQuizBookbyId(quizBookId);
    await this.checkAuthorization(quizBook.ownerId, userId);

    return quizBook;
  }

  async getSolvingQuizBook(
    quizBookId: number,
    userId: number,
  ): Promise<QuizBookWithSolvingQuizResponseDTO> {
    const quizBook = await this.quizBookRepository.query(
      `
      SELECT qb.id, qb.quizCount, qb.lastQuizId, qb.updatedAt,
      usqb.savedCorrectCount, usqb.savedQuizId, usqb.completed as allSolved, usqb.updatedAt as solvedAt
      FROM quizBook as qb LEFT JOIN userSolveQuizBook as usqb
      ON qb.id = usqb.quizBookId AND usqb.userId =? 
      WHERE qb.id = ?;
    `,
      [userId, quizBookId],
    );

    return new QuizBookWithSolvingQuizResponseDTO(quizBook[0]);
  }

  async syncQuizBookUpdatedAt(quizBookId: number) {
    const quizBook = await this.quizBookRepository.findOne({ id: quizBookId });
    quizBook.updatedAt = new Date();
    await this.quizBookRepository.save(quizBook);
  }
}
