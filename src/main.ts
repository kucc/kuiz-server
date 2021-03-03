import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.use(fileUpload());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
