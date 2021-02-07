import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserResponseDTO } from './dto/user-response.dto';
import { UserService } from './user.service';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { IRequest } from 'src/common/google.strategy';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  public async getAllUsers(): Promise<UserResponseDTO[]> {
    return await this.userService.getAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get('profile')
  async getProfile(@Req() request: IRequest): Promise<UserResponseDTO> {
    const { email } = request.user;
    const user = await this.userService.findByEmail(email);

    return user;
  }
}
