import { IsString, IsEmail } from 'class-validator';

export default class CreateUserDTO {
  @IsString()
  public readonly name: string;

  @IsEmail()
  public readonly email: string;
}
