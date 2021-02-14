import { IsString, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export default class CreateQuizRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  public quizBookId: number;

  @IsNotEmpty()
  @IsNumber()
  public readonly order: number;

  @IsNotEmpty()
  @IsString()
  public readonly question: string;

  @IsNotEmpty()
  @IsString()
  public readonly answer: string;

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

  @IsBoolean()
  public readonly isChoice: boolean;
}
