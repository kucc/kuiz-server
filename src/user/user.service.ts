import { Repository } from 'typeorm';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserResponseDTO } from './dto/user-response.dto';

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
}
