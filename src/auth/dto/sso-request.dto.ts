import { IsEmail, IsString } from 'class-validator';
import SSOUserDTO from './sso-user.dto';

export default class SSORequestDTO {
  constructor(sso: SSOUserDTO) {
    this.email = sso.email;
    this.name = sso.name.length > 10 ? sso.name.slice(0, 10) : sso.name;
    this.isMember = true;
  }

  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly name: string;

  public readonly isMember: boolean;
}
