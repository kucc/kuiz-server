import {
  BadRequestException,
  Injectable,
  ConflictException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/user.entity';
import CreateUserDTO from './dto/create-user.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { SSORequestDTO } from './dto/sso-request.dto';

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

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    return user;
  }

  async createUser(user: CreateUserDTO): Promise<UserResponseDTO> {
    // const kuDomain = req.user.email.indexOf('@korea.ac.kr');
    // if (kuDomain > -1) {
    //   // true: ku member -> but how to know whether kucc member?
    // }
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
    const user = await this.findByEmail(email);
    const updatedUser = this.userRepository.merge(user, { name: nickname });

    await this.userRepository.save(updatedUser).catch(() => {
      throw new ServiceUnavailableException();
    });

    return updatedUser;
  }

  async getUserRank(userid) {
    const rank = await this.userRepository.query(`SELECT name, point, level, 
    (SELECT COUNT(*)+1 FROM user WHERE point > u.point ) AS rank FROM user AS u WHERE id=${userid}`);

    return rank;
  }
}
