import { UserEntity } from '../../entity/user.entity';

export class UserResponseDTO {
  public constructor(user: UserEntity) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.point = user.point;
    this.level = user.level;
    this.isMember = user.isMember;
  }

  public readonly id: number;
  public readonly name: string;
  public readonly email: string;
  public readonly point: number;
  public readonly level: number;
  public readonly isMember: boolean;
}
