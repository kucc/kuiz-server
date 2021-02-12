import { IsEmpty, IsNotEmpty } from 'class-validator';

export class CreateQuizBookDTO {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly categoryId: number;

  @IsEmpty()
  ownerName: string;

  @IsEmpty()
  ownerId: number;
}

export class EditQuizBookDTO {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly categoryId: number;
}
