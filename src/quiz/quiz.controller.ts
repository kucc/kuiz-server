import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { MemberGuard } from 'src/common/guards/member.guard';
import { QuizBookService } from 'src/quiz-book/quiz-book.service';
import UpdateQuizRequestDTO from './dto/update-quiz-request.dto';
import { QuizService } from './quiz.service';
import { StorageService } from 'src/storage/storage.service';

@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,

    @Inject(forwardRef(() => QuizBookService))
    private readonly quizBookService: QuizBookService,
    private readonly storageService: StorageService,
  ) {}

  @Patch(':quizId')
  @UseGuards(MemberGuard)
  async updateQuiz(
    @Req() request,
    @Param('quizId') quizId: number,
    @Body() requestDTO: UpdateQuizRequestDTO,
  ) {
    const quiz = await this.quizService.findById(quizId);
    const quizBook = await this.quizBookService.findQuizBookbyId(
      quiz.quizBookId,
    );

    if (quizBook.ownerId !== request.user.id) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    if (request.files) {
      const quizImageURL = await this.storageService.upload(request);
      requestDTO.imageURL = quizImageURL;
    }

    const updatedQuiz = await this.quizService.updateQuiz(quiz, requestDTO);

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
