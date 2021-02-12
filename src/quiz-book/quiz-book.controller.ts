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
  BadRequestException,
} from '@nestjs/common';
import { request, Request } from 'express';

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

@Controller('quiz-book')
export class QuizBookController {
  constructor(
    private readonly quizBookService: QuizBookService,

    @Inject(forwardRef(() => QuizService))
    private readonly quizService: QuizService,
  ) {}

  @Get(':id')
  async getQuizOfOrder(
    @Query() query: { order: number },
    @Param('id') id: number,
  ): Promise<QuizResponseDTO> {
    const quizzes = await this.quizService.findByQuizBookId(id);

    if (quizzes.length < query.order) {
      throw new BadRequestException('해당 번호의 문제가 없습니다.'); // check out of range
    }

    const quizOfOrder = quizzes[query.order - 1]; // or add 'order' column (논의)

    return new QuizResponseDTO(quizOfOrder);
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

  @Post(':id/quiz')
  @UseGuards(new MemberGuard())
  async createQuiz(
    @Param('id') id: number,
    @Body() newQuizDTO: CreateQuizRequestDTO,
  ): Promise<QuizResponseDTO> {
    await this.quizBookService.findQuizBookbyId(id);
    newQuizDTO.quizBookId = id;

    const newQuiz = await this.quizService.createQuiz(newQuizDTO);

    return new QuizResponseDTO(newQuiz);
  }

  @Delete(':id')
  @UseGuards(new MemberGuard())
  async deleteQuizBook(
    @Req() request: Request,
    @Param('id') quizBookId: number,
  ): Promise<{ result: boolean }> {
    const userId = request.user.id;

    return await this.quizBookService.deleteQuizBook(quizBookId, userId);
  }

  @Patch(':id')
  @UseGuards(new MemberGuard())
  async editQuizBookInfo(
    @Req() request: Request,
    @Param('id') quizBookId: number,
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

  @Patch(':id/like')
  @UseGuards(new UserGuard())
  async updateQuizBookLikes(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<LikeQuizBookResponseDTO> {
    const userId = request.user.id;

    const likeResult = await this.quizBookService.updateQuizBookLikes(
      id,
      userId,
    );

    return new LikeQuizBookResponseDTO(likeResult);
  }

  // TODO
  @Post(':id/solve')
  async solveQuiz(@Param('id') id: number) {
    const userId = request.user.id;
    await this.quizBookService.solveQuiz(id, userId);
  }
}
