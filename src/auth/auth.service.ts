import { Injectable } from '@nestjs/common';
import { GoogleUser } from 'src/common/google.strategy';
import { UserResponseDTO } from 'src/user/dto/user-response.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(googleUser: GoogleUser): Promise<UserResponseDTO> {
    const userInfo = { email: googleUser.email, name: googleUser.name };
    const user = await this.userService.findByEmail(userInfo.email);

    if (!user) {
      const newUser = await this.userService.createUser(userInfo);
      return newUser;
    }

    return user;
  }
}
