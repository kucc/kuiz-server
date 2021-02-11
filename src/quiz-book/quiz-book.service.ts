import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QuizBookEntity } from '../entity/quiz-book.entity';
import { CreateQuizBookDTO, EditQuizBookDTO } from './dto/quizbook-request.dto';
import { QuizBookResponseDTO } from './dto/quizbook-response.dto';

@Injectable()
export class QuizBookService {

  constructor(
    @InjectRepository(QuizBookEntity)
    private readonly quizBookRepository: Repository<QuizBookEntity>
  ){}

  async findQuizBookbyId(id: number): Promise<QuizBookEntity>{
    return await this.quizBookRepository.findOne({id});
  }

  async createQuizBook(
    userId: number, 
    userName: string, 
    quizbookDTO: CreateQuizBookDTO)
  : Promise<QuizBookEntity>{
    quizbookDTO.userId = userId;
    quizbookDTO.userName = userName;
    const quizBook = this.quizBookRepository.create(quizbookDTO);
    await this.quizBookRepository.save(quizBook);
    return quizBook;
  }

  async deleteQuizBook(id: number){
    const quizBook = await this.quizBookRepository.findOne(id);
    if(!quizBook){
     throw new NotFoundException(`존재하지 않는 문제집입니다.`);
    }
    await this.quizBookRepository.delete({id});
    return {result: true};
  }

  async editQuizBook(
    id: number, 
    quizbookDTO: EditQuizBookDTO)
    : Promise<QuizBookEntity>{
    const quizBook = await this.quizBookRepository.findOne(id);
    if(!quizBook){
      throw new NotFoundException(`존재하지 않는 문제집입니다.`);
    }

    const editedQuizBook = this.quizBookRepository.merge(quizBook, quizbookDTO);
    await this.quizBookRepository.save(editedQuizBook);
    return editedQuizBook;
  }
}
