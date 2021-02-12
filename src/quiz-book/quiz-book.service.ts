import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizBookEntity } from '../entity/quiz-book.entity';
import { UserSolveQuizBookService } from '../user-solve-quiz-book/user-solve-quiz-book.service';
import { CreateQuizBookDTO, EditQuizBookDTO } from './dto/quizbook-request.dto';

@Injectable()
export class QuizBookService {

  constructor(
    @InjectRepository(QuizBookEntity)
    private readonly quizBookRepository: Repository<QuizBookEntity>,
    
    private readonly userSolveQuizBookService: UserSolveQuizBookService,
  ){}

  async findQuizBookbyId(id: number): Promise<QuizBookEntity>{
    const quizBook = await this.quizBookRepository.findOne({id});
    if(!quizBook){
      throw new NotFoundException('존재하지 않는 문제집입니다.');
    }
    return quizBook;
  }

  async createQuizBook(
    userId: number, 
    userName: string, 
    quizbookDTO: CreateQuizBookDTO)
  : Promise<QuizBookEntity>{
    quizbookDTO.ownerId = userId;
    quizbookDTO.ownerName = userName;
    const quizBook = this.quizBookRepository.create(quizbookDTO);
    await this.quizBookRepository.save(quizBook);
    return quizBook;
  }

  async deleteQuizBook(id: number){
    await this.findQuizBookbyId(quizBookId);
    await this.checkAuthorization(quizBookId, userId);

    await this.quizBookRepository.delete({id: quizBookId});
    await this.quizBookRepository.delete({id});
    return {result: true};
  }

  async editQuizBook(
    id: number, 
    quizbookDTO: EditQuizBookDTO)
    : Promise<QuizBookEntity>{
    const quizBook = await this.findQuizBookbyId(quizBookId);

    await this.checkAuthorization(quizBookId, userId);

    const editedQuizBook = this.quizBookRepository.merge(quizBook, quizbookDTO);
    await this.quizBookRepository.save(editedQuizBook);
    return editedQuizBook;
  }

  async updateQuizBookLikes(quizBookId: number, userId: number)
  : Promise<QuizBookEntity>{
    const quizBook = await this.findQuizBookbyId(quizBookId);

    const like = await this.userSolveQuizBookService.toggleQuizBookLikes(quizBookId, userId);
    if(like){
      await this.quizBookRepository.increment(quizBook, 'likedCount', 1);
    }else {
      await this.quizBookRepository.increment(quizBook, 'likedCount', -1);
    }

    return quizBook;
  }

  async solveQuiz(quizId: number, userId: number){
  }
}
