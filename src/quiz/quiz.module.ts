import { Module, forwardRef } from '@nestjs/common';
import { QuizEntity } from 'src/entity/quiz.entity';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizService } from './quiz.service';
import { QuizBookModule } from 'src/quiz-book/quiz-book.module';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QuizEntity]),
    forwardRef(() => QuizBookModule),
    StorageModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports: [QuizService],
})
export class QuizModule {}
