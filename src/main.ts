import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';

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

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();
