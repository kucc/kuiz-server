import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';

import SSOUserDTO from './dto/sso-user.dto';
import { UserService } from '../user/user.service';
import { SSORequestDTO } from '../user/dto/sso-request.dto';
import { GoogleUserInfo } from 'src/common/google-auth-interface';
import { UserResponseDTO } from 'src/user/dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(userInfo: GoogleUserInfo): Promise<UserResponseDTO> {
    const user = await this.userService.findUserByEmail(userInfo.email);

    if (!user) {
      const newUser = await this.userService.createUser(userInfo);
      return newUser;
    }

    return user;
  }

  async linkWithSSO(ssoRequestDTO: SSORequestDTO): Promise<UserResponseDTO> {
    const userExist = await this.userService.findUserByEmail(
      ssoRequestDTO.email,
    );

    if (!userExist) {
      const newUser = await this.userService.createUserBySSO(ssoRequestDTO);
      return newUser;
    }

    if (!userExist.isMember) {
      await this.userService.joinUserWithSSO(userExist);
    }

    return userExist;
  }

  public decryptCodeFromSSOServer(code: string): SSOUserDTO {
    const { data } = jwt.verify(code, process.env.SSO_JWT_SECRET) as {
      data: SSOUserDTO;
    };

    return data;
  }

  public createAccessToken(userResponseDTO: UserResponseDTO): string {
    return jwt.sign(
      { data: userResponseDTO, timestamp: Date.now() },
      process.env.JWT_SECRET,
      {
        expiresIn: Number(process.env.JWT_EXPIRATION),
      },
    );
  }
}
