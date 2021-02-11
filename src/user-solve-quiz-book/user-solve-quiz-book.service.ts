import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSolveQuizBookEntity } from '../entity/user-solve-quiz-book.entity';

@Injectable()
export class UserSolveQuizBookService {
  constructor(
    @InjectRepository(UserSolveQuizBookEntity)
    private readonly userSolveQuizBookRepository: Repository<UserSolveQuizBookEntity>
  ){}

  async findbyQBIdandUserId(quizBookId: number, userId: number)
  {
    return await this.userSolveQuizBookRepository.findOne({
      where: {
        quizBookId,
        userId,
      }
    });
  }

  async createUserSolveQuizBook(quizBookId: number, userId: number): Promise<UserSolveQuizBookEntity>{
    const newUSQB = this.userSolveQuizBookRepository.create({quizBookId, userId});
    await this.userSolveQuizBookRepository.save(newUSQB);
    return newUSQB;
  }

  async toggleQuizBookLikes(quizBookId: number, userId: number): Promise<boolean>{
    let solve = await this.findbyQBIdandUserId(quizBookId, userId);

    if(!solve){
      solve = await this.createUserSolveQuizBook(quizBookId, userId);
    }

    if(solve.liked){
      solve.liked = false;
    }else {
      solve.liked = true;
    }
    await this.userSolveQuizBookRepository.save(solve);

    return solve.liked;
  }
}
