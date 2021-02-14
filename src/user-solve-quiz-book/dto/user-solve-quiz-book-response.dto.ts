import { IsNotEmpty } from 'class-validator';
import { UserSolveQuizBookEntity } from '../../entity/user-solve-quiz-book.entity';

export class SolveResultQuizBookDTO {
  constructor(solveResult: UserSolveQuizBookEntity) {
    this.id = solveResult.id;
    this.completed = solveResult.completed;
    this.savedQuizId = solveResult.savedQuizId;
  }
  @IsNotEmpty()
  readonly id: number;

  @IsNotEmpty()
  readonly completed: boolean;

  @IsNotEmpty()
  readonly savedQuizId: number;
}
