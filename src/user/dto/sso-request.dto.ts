import { IsEmail, IsString } from "class-validator";
import SSOUserDTO from "../../auth/dto/sso-user.dto";

export class SSORequestDTO{
  constructor(sso: SSOUserDTO){
    this.email = sso.email;
    this.name = sso.name;
    this.isMember = true;
  }

  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly name: string;

  public readonly isMember: boolean;
}