import { IsNotEmpty } from 'class-validator';

export class SolveQuizBookDTO {
  @IsNotEmpty()
  readonly quizId: number;

  @IsNotEmpty()
  readonly isCorrect: boolean;
}
