import { IsNotEmpty } from "class-validator";

export class CreateQuizBookDTO{

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly categoryId: number;

  userName: string;

  userId: number;
}

export class EditQuizBookDTO{

  @IsNotEmpty()
  readonly title: string;

  readonly categoryId: number;
  
}