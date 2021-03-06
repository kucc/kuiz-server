import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizBookEntity } from 'src/entity/quiz-book.entity';
import { UserModule } from 'src/user/user.module';
import { UserSolveQuizBookEntity } from '../entity/user-solve-quiz-book.entity';
import { UserSolveQuizBookService } from './user-solve-quiz-book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSolveQuizBookEntity, QuizBookEntity]),
    UserModule,
  ],
  providers: [UserSolveQuizBookService],
  exports: [UserSolveQuizBookService],
})
export class UserSolveQuizBookModule {}
