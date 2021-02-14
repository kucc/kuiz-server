import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { QuizBookModule } from './quiz-book/quiz-book.module';
import { DeserializeUserMiddleware } from './common/middleware/deserialize-user';
import { UserSolveQuizBookModule } from './user-solve-quiz-book/user-solve-quiz-book.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.local',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
    }),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    QuizModule,
    QuizBookModule,
    UserSolveQuizBookModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(DeserializeUserMiddleware).forRoutes('*');
  }
}
