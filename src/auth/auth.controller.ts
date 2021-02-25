import {
  Controller,
  Get,
  Req,
  Res,
  HttpService,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AxiosResponse } from 'axios';
import {
  GOOGLE_REDIRECT_URI,
  GOOGLE_RESPONSE_TYPE,
  GOOGLE_AUTH_SCOPE,
  GOOGLE_AUTH_PROMPT,
  TOKEN_GRANT_TYPE,
} from '../common/google-auth-constant';
import {
  GoogleUserInfo,
  GoogleAuthQuery,
  GoogleTokenQuery,
  IRequest,
} from 'src/common/google-auth-interface';
import { stringify } from 'querystring';
import { LoginQueryDTO } from './dto/login-query.dto';
import { SSORequestDTO } from '../user/dto/sso-request.dto';
import setAccessTokenCookie from 'src/common/lib/set-access-token-cookie';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  @Get('google')
  async login(@Res() response: Response) {
    const authConfig: GoogleAuthQuery = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: GOOGLE_RESPONSE_TYPE,
      scope: GOOGLE_AUTH_SCOPE,
      prompt: GOOGLE_AUTH_PROMPT,
    };

    response.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?${stringify(authConfig)}`,
    );
  }

  @Get('redirect')
  async googleAuthRedirect(
    @Req() request: IRequest,
    @Res() response: Response,
  ) {
    // token 요청
    const tokenConfig: GoogleTokenQuery = {
      code: request.query.code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: TOKEN_GRANT_TYPE,
    };

    const tokenResponse: AxiosResponse = await this.httpService
      .post(`https://oauth2.googleapis.com/token?${stringify(tokenConfig)}`)
      .toPromise();

    const accessToken = tokenResponse.data.access_token;

    // userinfo 요청
    const userResponse: AxiosResponse = await this.httpService
      .get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .toPromise()
      .catch((error) => {
        throw new UnauthorizedException('인증 되지 않은 사용자입니다.', error);
      });

    const userInfo: GoogleUserInfo = {
      email: userResponse.data.email,
      name: userResponse.data.name,
    };

    const user = await this.authService.validateUser(userInfo); //new or exist
    const kuizAccessToken = this.authService.createAccessToken(user);
    setAccessTokenCookie(response, kuizAccessToken);
    response.redirect(process.env.CLIENT_URL, 301);
  }

  @Get('kucc')
  async loginByKUCC(@Res() res: Response) {
    const ssoURL = process.env.SSO_URL;
    const redirectURL = process.env.KUCC_REDIRECT_URL;

    const requestURL = ssoURL + '?redirect=' + redirectURL;
    res.redirect(requestURL);
  }

  @Get('login')
  async callbackBySSO(
    @Query() query: LoginQueryDTO,
    @Res() response: Response,
  ) {
    const code = query.code;
    const userData = this.authService.decryptCodeFromSSOServer(code);

    const ssoRequestDTO = new SSORequestDTO(userData);

    const linkedUser = await this.authService.linkWithSSO(ssoRequestDTO);

    //로그인
    const accessToken = this.authService.createAccessToken(linkedUser);
    setAccessTokenCookie(response, accessToken);
    response.redirect(process.env.CLIENT_URL, 301);
  }

  @Get('logout')
  async logout(@Res() response: Response) {
    setAccessTokenCookie(response, '');
    response.redirect(process.env.CLIENT_URL, 301);
  }
}
