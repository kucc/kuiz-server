import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSolveQuizBookEntity } from 'src/entity/user-solve-quiz-book.entity';
import { QuizModule } from 'src/quiz/quiz.module';
import { StorageModule } from 'src/storage/storage.module';
import { QuizBookEntity } from '../entity/quiz-book.entity';
import { QuizBookController } from './quiz-book.controller';
import { UserSolveQuizBookModule } from '../user-solve-quiz-book/user-solve-quiz-book.module';
import { UserModule } from '../user/user.module';
import { QuizBookService } from './quiz-book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizBookEntity, UserSolveQuizBookEntity]),
    UserSolveQuizBookModule,
    forwardRef(() => QuizModule),
    StorageModule,
    UserSolveQuizBookModule,
    UserModule,
  ],
  controllers: [QuizBookController],
  providers: [QuizBookService],
  exports: [QuizBookService],
})
export class QuizBookModule {}
