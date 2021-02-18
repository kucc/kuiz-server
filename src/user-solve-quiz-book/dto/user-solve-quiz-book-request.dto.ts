import { IsNotEmpty } from 'class-validator';

export class SolveQuizBookDTO {
  @IsNotEmpty()
  readonly quizOrder: number;

  @IsNotEmpty()
  readonly quizId: number;

  @IsNotEmpty()
  readonly isCorrect: boolean;
}
