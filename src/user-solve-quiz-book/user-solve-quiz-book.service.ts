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
    let solvedQuizBook = await this.findbyQBIdandUserId(quizBookId, userId);

    if(!solvedQuizBook){
      solvedQuizBook = await this.createUserSolveQuizBook(quizBookId, userId);
    }

    if(solvedQuizBook.liked){
      solvedQuizBook.liked = false;
    }else {
      solvedQuizBook.liked = true;
    }
    await this.userSolveQuizBookRepository.save(solvedQuizBook);

    return solvedQuizBook.liked;
  }
}
