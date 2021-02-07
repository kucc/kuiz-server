import { Controller, Post, Get, Query, Res } from '@nestjs/common';
import { LoginQueryDTO } from './dto/login-query.dto';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { KUCCRequestDTO } from './dto/login-request.dto';
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ){}
  
  @Get('kucc')
  async loginByKUCC(@Res() res: Response){
    const url = `http://${process.env.REQUEST_URL}/login?`;
    const query = 'redirect=http://localhost:3308';
  
    const KUCCOauthURL = url + query;
    res.redirect(KUCCOauthURL);
  }

  @Get('login')
  async callbackBySSO(@Query() query:LoginQueryDTO, @Res() response: Response){
    const code = query.code;
    console.log(code);
    const userData = this.authService.decryptCodeFromSSOServer(code);

    let userExist = await this.userService.findUserByEmail(userData.email);

    if(!userExist){
      //회원가입
      const kuccRequestDTO = new KUCCRequestDTO(userData.email, userData.name);
      userExist = await this.userService.createUserByKUCC(kuccRequestDTO);
    }

    //로그인
    const accessToken = this.authService.createAccessToken(userExist);
    response.cookie('accessToken', accessToken);
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Cache-Control', ['no-cache', 'no-store', 'must-revalidate']);
    response.redirect(`http://${process.env.REDIRECT_URL}`, 301);

  }
}
