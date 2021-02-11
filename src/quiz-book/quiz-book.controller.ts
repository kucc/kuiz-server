import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { MemberGuard } from '../common/guards/member.guard';
import { CreateQuizBookDTO, EditQuizBookDTO } from './dto/quizbook-request.dto';
import { QuizBookResponseDTO, EditQuizBookResponseDTO } from './dto/quizbook-response.dto';
import { QuizBookService } from './quiz-book.service';

@Controller('quiz-book')
export class QuizBookController {

  constructor(
    private readonly quizBookService: QuizBookService,
  ){}

  @Post()
  @UseGuards(new MemberGuard())
  async createQuizBook(
    @Req() request: Request, 
    @Body() quizbookDTO: CreateQuizBookDTO)
  : Promise<QuizBookResponseDTO>{
    const user= request.user;
    const newQuizBook = await this.quizBookService.createQuizBook(user.id, user.name, quizbookDTO);
    return new QuizBookResponseDTO(newQuizBook);
  }

  @Delete(':id')
  @UseGuards(new MemberGuard())
  async deleteQuizBook(@Param('id') id: number){
   
    return await this.quizBookService.deleteQuizBook(id);
  }

  @Patch(':id')
  @UseGuards(new MemberGuard())
  async editQuizBookInfo(
    @Req() request: Request, 
    @Param('id') id: number, 
    @Body() quizbookDTO: EditQuizBookDTO)
    : Promise<EditQuizBookResponseDTO>{

    const editedQuizBook = await this.quizBookService.editQuizBook(id, quizbookDTO);
    return new EditQuizBookResponseDTO(editedQuizBook);
  }

  @Patch(':id/like')
  @UseGuards(new MemberGuard())
  async updateQuizBookLikes(@Param('id') id: number){

  }

  @Post(':id/solve')
  async solveQuiz(@Param('id') id: number){

  }
}
