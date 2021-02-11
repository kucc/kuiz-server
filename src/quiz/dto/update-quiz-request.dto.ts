import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export default class UpdateQuizRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  public readonly id: number;

  @IsNotEmpty()
  @IsNumber()
  public readonly quizBookId: number;

  @IsString()
  public readonly question: string;

  // @IsString())
  // public readonly answer: string;
  // 문제 수정 규칙

  @IsString()
  public readonly option1: string;

  @IsString()
  public readonly option2: string;

  @IsString()
  public readonly option3: string;

  @IsString()
  public readonly option4: string;

  @IsString()
  public readonly imageURL: string;

  @IsString()
  public readonly description: string;
}
