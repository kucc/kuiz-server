import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizBookEntity } from '../entity/quiz-book.entity';
import { UserSolveQuizBookModule } from '../user-solve-quiz-book/user-solve-quiz-book.module';
import { QuizBookController } from './quiz-book.controller';
import { QuizBookService } from './quiz-book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizBookEntity]),
    UserSolveQuizBookModule
  ],
  controllers: [QuizBookController],
  providers: [QuizBookService],
  exports: [QuizBookService],
})
export class QuizBookModule {}
