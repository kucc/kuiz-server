import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  HttpService,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticationGuard } from 'src/common/guard/authentication.guard';
import { CheckLoginGuard } from 'src/common/guard/check-login.guard';
import { LoginGuard } from 'src/common/guard/login.guard';
import { UserResponseDTO } from '../user/dto/user-response.dto';
import { AuthService } from './auth.service';
import { AxiosResponse } from 'axios';
import { IRequest } from 'src/common/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  @Get('')
  @UseGuards(CheckLoginGuard)
  async login(@Res() response: Response) {
    response.redirect('auth/google');
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  private googleAuth(): void {
    // Don't call directly
  }

  @Get('redirect')
  @UseGuards(LoginGuard)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() request: IRequest): Promise<UserResponseDTO> {
    const user = await this.authService.validateUser(request.user); //new or exist

    return new UserResponseDTO(user);
  }

  @Get('logout')
  @UseGuards(AuthenticationGuard)
  async logout(@Req() request: IRequest) {
    // option
    // for prompt (choose account) after logout
    // else should extra logout on google
    const resp: void | AxiosResponse<any> = await this.httpService
      .get(
        `https://accounts.google.com/o/oauth2/revoke?token=${request.user.accessToken}`,
      )
      .toPromise()
      .catch(() => {
        throw new BadRequestException('잘못된 요청입니다.');
      });

    const result = {
      status: resp.status,
      message: resp.statusText,
    };

    console.log(resp.status);
    request.logout(); // remove session

    return result;
  }
}
