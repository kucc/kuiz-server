import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Query,
  UseGuards,
  forwardRef,
  Inject,
  DefaultValuePipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { Request } from 'express';

import {
  QuizBookResponseDTO,
  LikeQuizBookResponseDTO,
  QuizBookWithQuizResponseDTO,
  SolvingQuizBookWithQuizResponseDTO,
} from './dto/quizbook-response.dto';
import { QuizService } from 'src/quiz/quiz.service';
import { QuizBookService } from './quiz-book.service';
import { UserGuard } from '../common/guards/user.guard';
import { MemberGuard } from '../common/guards/member.guard';
import { StorageService } from 'src/storage/storage.service';
import { QuizResponseDTO } from 'src/quiz/dto/quiz-response.dto';
import CreateQuizRequestDTO from 'src/quiz/dto/create-quiz-request.dto';
import { CreateQuizBookDTO, EditQuizBookDTO } from './dto/quizbook-request.dto';
import { SolveQuizBookDTO } from '../user-solve-quiz-book/dto/user-solve-quiz-book-request.dto';
import { SolveResultQuizBookDTO } from '../user-solve-quiz-book/dto/user-solve-quiz-book-response.dto';
import { UserSolveQuizBookEntity } from 'src/entity/user-solve-quiz-book.entity';

@Controller('quiz-book')
export class QuizBookController {
  constructor(
    private readonly quizBookService: QuizBookService,

    @Inject(forwardRef(() => QuizService))
    private readonly quizService: QuizService,
    private readonly storageService: StorageService,
  ) {}

  @Get('search')
  @UseGuards(new UserGuard())
  async searchQuizBookListByKeyword(
    @Req() req: Request,
    @Query('categoryId') categoryId: number,
    @Query('page') page: number,
    @Query('keyword') keyword: string,
    @Query('isSortByDate') isSortByDate: string,
    @Query('isUnSolved') isUnSolved: string,
  ) {
    const userId = req.user.id;
    if (isUnSolved === 'true') {
      const quizBookList = await this.quizBookService.getQuizBookListByKeyword(
        userId,
        categoryId,
        page,
        keyword,
        isSortByDate === 'true',
      );
      return quizBookList;
    } else {
      const quizBookList = await this.quizBookService.getUnSolvedQuizBookListByKeyword(
        userId,
        categoryId,
        page,
        keyword,
        isSortByDate == 'true',
      );
      return quizBookList;
    }
  }

  @Get('solving')
  @UseGuards(new UserGuard())
  async getQuizBookSolvedByUser(
    @Req() request: Request,
    @Query('isDone', new DefaultValuePipe(false), ParseBoolPipe)
    isDone: boolean,
  ) {
    const { user } = request;
    const quizBookList = await this.quizBookService.getQuizBookSolvedByUser(
      user.id,
      isDone,
    );

    return quizBookList;
  }

  @Get('owner')
  @UseGuards(new UserGuard())
  async getQuizBookOwnedByUSer(
    @Req() request: Request,
    @Query('isDone', new DefaultValuePipe(false), ParseBoolPipe)
    isDone: boolean,
  ) {
    const { user } = request;
    const quizBookList = await this.quizBookService.getQuizBookOwnedByUSer(
      user.id,
      isDone,
    );

    return quizBookList;
  }

  @UseGuards(new UserGuard())
  @Get(':id/quiz')
  async getQuizBookwithSolvingQuiz(
    @Req() request: Request,
    @Param('id') quizBookId: number,
  ): Promise<SolvingQuizBookWithQuizResponseDTO> {
    const userId = request.user.id;
    const quizBookWithQuiz = await this.quizService.getSolvingQuizBookwithQuiz(
      quizBookId,
      userId,
    );

    return quizBookWithQuiz;
  }

  @UseGuards(new UserGuard())
  @Get(':quizBookId/result')
  async getQuizBookSolveResult(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
  ): Promise<UserSolveQuizBookEntity> {
    const userId = request.user.id;
    const quizBookResult = this.quizBookService.getQuizBookSolveResult(
      userId,
      quizBookId,
    );

    return quizBookResult;
  }

  @Get('unsolved')
  @UseGuards(new UserGuard())
  async getUnsolvedQuizBookByUser(
    @Req() request: Request,
    @Query('categoryId') categoryId: number,
    @Query('page') page: number,
    @Query('isSortByDate', new DefaultValuePipe(false), ParseBoolPipe)
    isSortByDate: boolean,
  ) {
    const { user } = request;
    const unsolvedQuizBookList = await this.quizBookService.getUnsolvedQuizBookByUser(
      categoryId,
      user.id,
      page,
      isSortByDate,
    );

    return unsolvedQuizBookList;
  }

  @UseGuards(new UserGuard())
  @Get('')
  async getQuizBookList(
    @Req() req: Request,
    @Query('categoryId') categoryId: number,
    @Query('page') page: number,
    @Query('isSortByDate', new DefaultValuePipe(false), ParseBoolPipe)
    isSortByDate: boolean,
  ) {
    const userId = req.user.id;
    const quizBookList = await this.quizBookService.findAllQuizBookByCategory(
      userId,
      categoryId,
      page,
      isSortByDate,
    );

    return quizBookList;
  }

  @Post(':quizBookId/solve')
  @UseGuards(new UserGuard())
  async solveQuizBook(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
    @Body() solveQuizBookDTO: SolveQuizBookDTO,
  ): Promise<SolveResultQuizBookDTO> {
    const userId = request.user.id;

    return await this.quizBookService.solveQuizBook(
      quizBookId,
      userId,
      solveQuizBookDTO,
    );
  }

  @Post(':quizBookId/quiz')
  @UseGuards(new MemberGuard())
  async createQuiz(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
    @Body() newQuizDTO: CreateQuizRequestDTO,
  ): Promise<QuizResponseDTO> {
    newQuizDTO.quizBookId = quizBookId;
    if (request.files) {
      const quizImageURL = await this.storageService.upload(request);
      newQuizDTO.imageURL = quizImageURL;
    }

    const newQuiz = await this.quizService.createQuiz(newQuizDTO);

    return new QuizResponseDTO(newQuiz);
  }

  @Post()
  @UseGuards(new MemberGuard())
  async createQuizBook(
    @Req() request: Request,
    @Body() quizBookDTO: CreateQuizBookDTO,
  ): Promise<QuizBookResponseDTO> {
    const user = request.user;
    const newQuizBook = await this.quizBookService.createQuizBook(
      user.id,
      user.name,
      quizBookDTO,
    );

    return new QuizBookResponseDTO(newQuizBook);
  }

  @Delete(':quizBookId')
  @UseGuards(new MemberGuard())
  async deleteQuizBook(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
  ): Promise<{ result: boolean }> {
    const userId = request.user.id;

    return await this.quizBookService.deleteQuizBook(quizBookId, userId);
  }

  @Patch(':quizBookId/like')
  @UseGuards(new UserGuard())
  async updateQuizBookLikes(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
  ) {
    const userId = request.user.id;

    return await this.quizBookService.updateQuizBookLikes(quizBookId, userId);
  }

  @Get(':quizBookId/like')
  @UseGuards(new UserGuard())
  async getQuizBookLikes(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
  ): Promise<LikeQuizBookResponseDTO> {
    const userId = request.user.id;
    return await this.quizBookService.getQuizBookLikes(quizBookId, userId);
  }

  @Get('/:quizBookId')
  async getAuthQuizBookwithQuizList(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
  ): Promise<QuizBookWithQuizResponseDTO> {
    const userId = request.user.id;

    const quizBook = await this.quizBookService.getAuthorizedQuizBook(
      quizBookId,
      userId,
    );
    const quizList = await this.quizService.getAllQuizByQuizBookId(quizBookId);
    quizBook.quizs = quizList;

    return new QuizBookWithQuizResponseDTO(quizBook);
  }

  @Patch(':quizBookId')
  @UseGuards(new MemberGuard())
  async editQuizBook(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
    @Body() quizBookDTO: EditQuizBookDTO,
  ): Promise<QuizBookWithQuizResponseDTO> {
    const userId = request.user.id;
    const editedQuizBook = await this.quizBookService.editQuizBook(
      quizBookId,
      quizBookDTO,
      userId,
    );

    const quizList = await this.quizService.getAllQuizByQuizBookId(quizBookId);
    editedQuizBook.quizs = quizList;

    return new QuizBookWithQuizResponseDTO(editedQuizBook);
  }
}
