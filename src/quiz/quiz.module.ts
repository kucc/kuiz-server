import { Module, forwardRef } from '@nestjs/common';
import { QuizEntity } from 'src/entity/quiz.entity';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from './quiz.service';
import { QuizBookModule } from 'src/quiz-book/quiz-book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizEntity]),
    forwardRef(() => QuizBookModule),
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
