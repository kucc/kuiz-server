import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { QuizController } from './quiz/quiz.controller';
import { CategoryController } from './category/category.controller';
import { QuizBookController } from './quiz-book/quiz-book.controller';
import { UserSolveQuizBookController } from './user-solve-quiz-book/user-solve-quiz-book.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, QuizController, CategoryController, QuizBookController, UserSolveQuizBookController],
  providers: [AppService],
})
export class AppModule {}
