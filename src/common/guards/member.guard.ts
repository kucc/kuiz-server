import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class MemberGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user.isMember) {
      throw new UnauthorizedException('인증된 회원만 이용가능한 서비스입니다.');
    }
    return true;
  }
}
