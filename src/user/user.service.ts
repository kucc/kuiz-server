import { Repository } from 'typeorm';
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { UserResponseDTO } from './dto/user-response.dto';
import { KUCCRequestDTO } from '../auth/dto/login-request.dto';

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

  ///수정
  async findUserByEmail(email: string): Promise<UserEntity>{
    return await this.UserRepository.findOne(
      {
        email: email
      }
    );
  }

  async createUserByKUCC(kuccRequestDTO: KUCCRequestDTO): Promise<UserEntity>{

    const newUser = this.UserRepository.create(kuccRequestDTO);
    
    newUser.isMember = true;
    await this.UserRepository.save(newUser);
    return newUser;
  }
}
