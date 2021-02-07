import { Injectable } from '@nestjs/common';
import { GoogleUserInfo } from 'src/common/google-auth-interface';
import { UserResponseDTO } from 'src/user/dto/user-response.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(userInfo: GoogleUserInfo): Promise<UserResponseDTO> {
    const user = await this.userService.findByEmail(userInfo.email);

    if (!user) {
      const newUser = await this.userService.createUser(userInfo);
      return newUser;
    }

    return user;
  }
}
