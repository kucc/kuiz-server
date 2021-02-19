import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MemberGuard } from 'src/common/guards/member.guard';
import UpdateQuizRequestDTO from './dto/update-quiz-request.dto';
import { QuizService } from './quiz.service';
import { StorageService } from 'src/storage/storage.service';

@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly storageService: StorageService,
  ) {}

  @Patch(':quizId')
  @UseGuards(MemberGuard)
  async updateQuiz(
    @Req() request,
    @Param('quizId') quizId: number,
    @Body() requestDTO: UpdateQuizRequestDTO,
  ) {
    const userId = request.user.id;
    const quiz = await this.quizService.findById(quizId);

    if (request.files) {
      const quizImageURL = await this.storageService.upload(request);
      requestDTO.imageURL = quizImageURL;
    }

    const updatedQuiz = await this.quizService.updateQuiz(
      userId,
      quiz,
      requestDTO,
    );

    return updatedQuiz;
  }

  @Delete(':quizId')
  @UseGuards(MemberGuard)
  async deleteQuiz(
    @Param('quizId') quizId: number,
  ): Promise<{ result: boolean }> {
    return await this.quizService.deleteQuiz(quizId);
  }
}
