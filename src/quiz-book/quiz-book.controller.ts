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
} from '@nestjs/common';
import { Request } from 'express';

import { QuizBookService } from './quiz-book.service';
import { UserGuard } from '../common/guards/user.guard';
import { MemberGuard } from '../common/guards/member.guard';
import { CreateQuizBookDTO, EditQuizBookDTO } from './dto/quizbook-request.dto';
import {
  QuizBookResponseDTO,
  EditQuizBookResponseDTO,
  LikeQuizBookResponseDTO,
} from './dto/quizbook-response.dto';
import { QuizService } from 'src/quiz/quiz.service';
import { QuizResponseDTO } from 'src/quiz/dto/quiz-response.dto';
import CreateQuizRequestDTO from 'src/quiz/dto/create-quiz-request.dto';
import { StorageService } from 'src/storage/storage.service';
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

  @Get('solving')
  @UseGuards(new UserGuard())
  async getQuizBookSolvedByUser(
    @Req() request: Request,
    @Query('isDone') isDone: boolean,
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
    @Query('isDone') isDone: boolean,
  ) {
    const { user } = request;
    const quizBookList = await this.quizBookService.getQuizBookOwnedByUSer(
      user.id,
      isDone,
    );

    return quizBookList;
  }

  @Get(':quizBookId/quiz')
  async getQuizOfOrder(
    @Query() query: { order: number },
    @Param('quizBookId') quizBookId: number,
  ): Promise<QuizResponseDTO> {
    const quizOfOrder = await this.quizService.findByQuizBookIdAndOrder(
      quizBookId,
      query.order,
    );

    return new QuizResponseDTO(quizOfOrder);
  }

  @Get('')
  async getQuizBookList(
    @Query('categoryId') categoryId: number,
    @Query('page') page: number,
  ) {
    const quizBookList = await this.quizBookService.findAllQuizBookByCategory(
      categoryId,
      page,
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

    return new LikeQuizBookResponseDTO(likedQuizBook);
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
