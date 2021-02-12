import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSolveQuizBookEntity } from '../entity/user-solve-quiz-book.entity';
import { UserSolveQuizBookService } from './user-solve-quiz-book.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSolveQuizBookEntity])],
  providers: [UserSolveQuizBookService],
  exports: [UserSolveQuizBookService],
})
export class UserSolveQuizBookModule {}
