import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';

import { UserModule } from './user/user.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.NODE_ENV === 'dev'? '.env.dev': '.env.local',
    ignoreEnvFile: process.env.NODE_ENV === 'prod'
  }),
  TypeOrmModule.forRoot(),
  UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
