import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { request, Request } from 'express';
import { UpdateNicknameRequestDTO } from './dto/update-nickname.dto';
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

  @Patch('/:userId/nickname')
  public async updateUserNickname(
    @Req() reqeust: Request,
    @Body() nicknameDTO: UpdateNicknameRequestDTO,
  ) {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException();
    }

    const updatedUser = await this.userService.updateUserNickname(
      user.email,
      nicknameDTO.nickname,
    );

    return updatedUser;
  }
}
