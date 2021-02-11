import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserGuard } from 'src/common/guards/user.guard';
import UpdateQuizRequestDTO from './dto/update-quiz-request.dto';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService, // private readonly quizBookService: QuizBookService,
  ) {}

  @Patch(':quizId')
  @UseGuards(UserGuard)
  async updateQuiz(
    @Req() request,
    @Param('quizId') quizId: number,
    @Body() requestDTO: UpdateQuizRequestDTO,
  ) {
    const quiz = await this.quizService.findById(quizId);

    // owner 검사
    // const quizBook = await this.quizBookService.findById(requestDTO.quizBookId);
    // if (quizBook.ownerId !== request.user.id) {
    //   throw new UnauthorizedException('권한이 없습니다.');
    // }

    const updatedQuiz = await this.quizService.updateQuiz(quiz, requestDTO);
    return updatedQuiz;
  }

  @Delete(':quizId')
  @UseGuards(UserGuard)
  async deleteQuiz(
    @Param('quizId') quizId: number,
  ): Promise<{ result: boolean }> {
    return await this.quizService.deleteQuiz(quizId);
  }
}
