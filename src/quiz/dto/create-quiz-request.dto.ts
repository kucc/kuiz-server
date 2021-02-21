import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export default class CreateQuizRequestDTO {
  public quizBookId: number;

  @IsNotEmpty()
  @IsString()
  public readonly question: string;

  @IsNotEmpty()
  @IsString()
  public readonly answer: string;

  @IsOptional()
  @IsString()
  public readonly option1: string;

  @IsOptional()
  @IsString()
  public readonly option2: string;

  @IsOptional()
  @IsString()
  public readonly option3: string;

  @IsOptional()
  @IsString()
  public readonly option4: string;

  @IsOptional()
  @IsString()
  public imageURL: string;

  @IsOptional()
  @IsString()
  public readonly description: string;

  @IsOptional()
  @IsBoolean()
  public readonly isChoice: boolean;
}
