import { IsString } from 'class-validator';

export class UpdateNicknameRequestDTO {
  @IsString()
  public readonly nickname: string;
}
