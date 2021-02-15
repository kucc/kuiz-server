import {
  BadRequestException,
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import CreateUserDTO from './dto/create-user.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { SSORequestDTO } from './dto/sso-request.dto';
import CreateUserRequestDTO from './dto/user-request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly UserRepository: Repository<UserEntity>,
  ) {}

  public async getAll(): Promise<UserResponseDTO[]> {
    const allUsers = await this.UserRepository.find().catch(() => {
      throw new ConflictException(
        '서버 점검중입니다. 잠시 후 다시 시도해주세요.',
      );
    });

    return allUsers;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.UserRepository.findOne({
      id,
    });
    if (!user) {
      throw new NotFoundException('잘못된 회원정보입니다.');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UserResponseDTO> {
    const user = await this.UserRepository.findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  async createUser(user: CreateUserRequestDTO): Promise<UserResponseDTO> {
    const newUser = this.UserRepository.create(user);
    await this.UserRepository.save(newUser).catch(() => {
      throw new BadRequestException('잘못된 요청입니다.');
    });

    return new UserResponseDTO(newUser);
  }

  async createUserBySSO(user: SSORequestDTO): Promise<UserResponseDTO> {
    const newUser = this.UserRepository.create(user);

    await this.UserRepository.save(newUser).catch(() => {
      throw new BadRequestException('잘못된 요청입니다.');
    });

    return new UserResponseDTO(newUser);
  }

  async joinUserWithSSO(user: UserResponseDTO) {
    await this.UserRepository.update(user, { isMember: true });
  }

  async increaseUserPoint(userId: number) {
    const user = await this.findUserById(userId);
    await this.UserRepository.increment(user, 'point', 30);
  }
}
