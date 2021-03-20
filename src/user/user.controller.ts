import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserGuard } from 'src/common/guards/user.guard';
import { UpdateNicknameRequestDTO } from './dto/update-nickname.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('rank')
  public async getTotalRank() {
    const rankList = await this.userService.getTotalPointRank();

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
  @UseGuards(new UserGuard())
  public async getUserInfo(@Req() request: Request): Promise<UserResponseDTO> {
    const { user } = request;
    const userInfo = await this.userService.findUserById(user.id);
    return new UserResponseDTO(userInfo);
  }

  @Patch('/nickname')
  @UseGuards(new UserGuard())
  public async updateUserNickname(
    @Req() request: Request,
    @Body() nicknameDTO: UpdateNicknameRequestDTO,
  ) {
    const { user } = request;
    const updatedUser = await this.userService.updateUserNickname(
      user.email,
      nicknameDTO.nickname,
    );

    return updatedUser;
  }
}
