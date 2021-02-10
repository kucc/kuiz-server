import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getUserInfo(@Req() request: Request): Promise<UserResponseDTO> {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
