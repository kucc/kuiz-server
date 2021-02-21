import { IsString, IsOptional } from 'class-validator';

export default class UpdateQuizRequestDTO {
  @IsOptional()
  @IsString()
  public readonly question: string;

  @IsOptional()
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
}
