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
  EditQuizBookResponseDTO,
  LikeQuizBookResponseDTO,
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

@Controller('quiz-book')
export class QuizBookController {
  constructor(
    private readonly quizBookService: QuizBookService,

    @Inject(forwardRef(() => QuizService))
    private readonly quizService: QuizService,
    private readonly storageService: StorageService,
  ) {}

  @Get('search')
  async searchQuizBookListByKeyword(
    @Query('categoryId') categoryId: number,
    @Query('keyword') keyword: string,
  ) {
    const quizBookList = await this.quizBookService.searchQuizBookListByKeyword(
      categoryId,
      keyword,
    );
    return quizBookList;
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

  @Get(':id/quiz')
  async getAllQuizBookQuiz(
    @Param('id') id: number,
  ): Promise<QuizResponseDTO[]> {
    const quizzes = await this.quizService.findAllByQuizBookId(id);

    return quizzes;
  }

  @Get('unsolved')
  @UseGuards(new UserGuard())
  async getUnsolvedQuizBookByUser(@Req() request: Request) {
    const { user } = request;
    const unsolvedQuizBookList = await this.quizBookService.getUnsolvedQuizBookByUser(
      user.id,
    );

    return unsolvedQuizBookList;
  }

  @Get('')
  async getQuizBookList(
    @Query('categoryId') categoryId: number,
    @Query('page') page: number,
    @Query('isSortByDate', new DefaultValuePipe(false), ParseBoolPipe)
    isSortByDate: boolean,
  ) {
    const quizBookList = await this.quizBookService.findAllQuizBookByCategory(
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
  ): Promise<LikeQuizBookResponseDTO> {
    const userId = request.user.id;
    const likedQuizBook = await this.quizBookService.updateQuizBookLikes(
      quizBookId,
      userId,
    );

    return likedQuizBook;
  }

  @Patch(':quizBookId')
  @UseGuards(new MemberGuard())
  async editQuizBookInfo(
    @Req() request: Request,
    @Param('quizBookId') quizBookId: number,
    @Body() quizBookDTO: EditQuizBookDTO,
  ): Promise<EditQuizBookResponseDTO> {
    const userId = request.user.id;
    const editedQuizBook = await this.quizBookService.editQuizBook(
      quizBookId,
      quizBookDTO,
      userId,
    );

    return new EditQuizBookResponseDTO(editedQuizBook);
  }
}
