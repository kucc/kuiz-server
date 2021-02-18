import { IsString } from 'class-validator';

export default class UpdateQuizRequestDTO {
  @IsString()
  public readonly question: string;

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
  public imageURL: string;

  @IsString()
  public readonly description: string;
}
