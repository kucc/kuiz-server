import { Controller, Get } from '@nestjs/common';
import { UserEntity } from '../entity/user.entity';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getAllUsers(): Promise<UserResponseDTO[]> {
    return await this.userService.getAll(); //test
  }
}
