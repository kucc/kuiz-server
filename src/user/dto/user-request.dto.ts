import { IsString, IsEmail } from 'class-validator';

export default class CreateUserRequestDTO {
  @IsString()
  public readonly name: string;

  @IsEmail()
  public readonly email: string;
}
