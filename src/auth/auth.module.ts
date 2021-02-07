import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from 'src/common/google.strategy';
import { SessionSerializer } from '../common/session.serializer';
import { HttpModule, Module } from '@nestjs/common';

@Module({
  imports: [UserModule, HttpModule, PassportModule.register({ session: true })],
  providers: [AuthService, GoogleStrategy, SessionSerializer],
})
export class AuthModule {}
