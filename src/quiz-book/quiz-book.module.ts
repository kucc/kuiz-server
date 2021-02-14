import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from 'src/quiz/quiz.module';
import { QuizBookEntity } from '../entity/quiz-book.entity';
import { QuizBookController } from './quiz-book.controller';
import { UserSolveQuizBookModule } from '../user-solve-quiz-book/user-solve-quiz-book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizBookEntity]),
    forwardRef(() => QuizModule),
    UserSolveQuizBookModule,
    UserModule,
  ],
  controllers: [QuizBookController],
  providers: [QuizBookService],
  exports: [QuizBookService],
})
export class QuizBookModule {}
