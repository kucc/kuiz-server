import { HttpModule, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
