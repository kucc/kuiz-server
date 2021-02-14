import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { request, Request } from 'express';
import { UserGuard } from 'src/common/guards/user.guard';
import { UpdateNicknameRequestDTO } from './dto/update-nickname.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('rank')
  public async getTotalRank(
    @Query('start') start: number,
    @Query('count') count: number,
  ) {
    const rankList = await this.userService.getTotalPointRank(start, count);

    return rankList;
  }

  @Get('rank/me')
  @UseGuards(new UserGuard())
  public async getUserRank(@Req() request: Request) {
    const { user } = request;
    const rank = await this.userService.getUserRank(user.id);

    return rank;
  }

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
