import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from 'src/quiz/quiz.module';
import { StorageModule } from 'src/storage/storage.module';
import { QuizBookEntity } from '../entity/quiz-book.entity';
import { UserSolveQuizBookModule } from '../user-solve-quiz-book/user-solve-quiz-book.module';
import { QuizBookController } from './quiz-book.controller';
import { QuizBookService } from './quiz-book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizBookEntity]),
    UserSolveQuizBookModule,
    forwardRef(() => QuizModule),
    StorageModule,
  ],
  controllers: [QuizBookController],
  providers: [QuizBookService],
  exports: [QuizBookService],
})
export class QuizBookModule {}
