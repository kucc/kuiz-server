import { IsNotEmpty } from 'class-validator';
import { UserSolveQuizBookEntity } from '../../entity/user-solve-quiz-book.entity';

export class SolveResultQuizBookDTO {
  constructor(solveResult: UserSolveQuizBookEntity, point?: number) {
    this.id = solveResult.id;
    this.completed = solveResult.completed;
    this.savedQuizId = solveResult.savedQuizId;
    this.point = point;
  }
  @IsNotEmpty()
  readonly id: number;

  @IsNotEmpty()
  readonly completed: boolean;

  @IsNotEmpty()
  readonly savedQuizId: number;

  point?: number;
}
