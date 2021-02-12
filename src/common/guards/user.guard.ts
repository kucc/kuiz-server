import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class UserGuard implements CanActivate{

  canActivate(context: ExecutionContext): boolean{

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if(!user){
      throw new UnauthorizedException("회원가입 후 이용해주세요");
    }
    return true;
  }
  
}