import {
  BadRequestException,
  Injectable,
  ConflictException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import { UserResponseDTO } from './dto/user-response.dto';
import { SSORequestDTO } from './dto/sso-request.dto';
import CreateUserRequestDTO from './dto/user-request.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepository: Repository<UserEntity>,
  ) {}

  public async getAll(): Promise<UserResponseDTO[]> {
    const allUsers = await this.userRepository.find().catch(() => {
      throw new ConflictException(
        '서버 점검중입니다. 잠시 후 다시 시도해주세요.',
      );
    });

    return allUsers;
  }

  async findUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      id,
    });
    if (!user) {
      throw new NotFoundException('잘못된 회원정보입니다.');
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  async createUser(user: CreateUserRequestDTO): Promise<UserResponseDTO> {
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser).catch(() => {
      throw new BadRequestException('잘못된 요청입니다.');
    });

    return new UserResponseDTO(newUser);
  }

  async createUserBySSO(user: SSORequestDTO): Promise<UserResponseDTO> {
    const newUser = this.userRepository.create(user);

    await this.userRepository.save(newUser).catch(() => {
      throw new BadRequestException('잘못된 요청입니다.');
    });

    return new UserResponseDTO(newUser);
  }

  async joinUserWithSSO(user: UserResponseDTO) {
    await this.userRepository.update(user, { isMember: true });
  }

  async updateUserNickname(email: string, nickname: string) {
    const user = await this.findUserByEmail(email);
    const updatedUser = this.userRepository.merge(user, { name: nickname });

    await this.userRepository.save(updatedUser).catch(() => {
      throw new ServiceUnavailableException();
    });

    return updatedUser;
  }

  async getTotalPointRank(start, count) {
    const rankList = await this.userRepository.find({
      order: {
        point: 'DESC',
      },
      skip: start - 1,
      take: count,
    });
    return rankList;
  }

  async getUserRank(userid) {
    const rank = await this.userRepository.query(`SELECT name, point, level, 
    (SELECT COUNT(*)+1 FROM user WHERE point > u.point ) AS rank FROM user AS u WHERE id=${userid}`);

    return rank[0];
  }

  async increaseUserPoint(userId: number, point: number) {
    const user = await this.findUserById(userId);
    await this.userRepository.increment(user, 'point', point);
  }
}
