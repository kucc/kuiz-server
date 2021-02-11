import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { request, Request } from 'express';

import { MemberGuard } from '../common/guards/member.guard';
import { UserGuard } from '../common/guards/user.guard';
import { CreateQuizBookDTO, EditQuizBookDTO } from './dto/quizbook-request.dto';
import { QuizBookResponseDTO, EditQuizBookResponseDTO, LikeQuizBookResponseDTO } from './dto/quizbook-response.dto';
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
    @Body() quizBookDTO: CreateQuizBookDTO)
  : Promise<QuizBookResponseDTO>{
    const user= request.user;
    const newQuizBook = await this.quizBookService.createQuizBook(user.id, user.name, quizBookDTO);
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
    @Body() quizBookDTO: EditQuizBookDTO)
    : Promise<EditQuizBookResponseDTO>{

    const editedQuizBook = await this.quizBookService.editQuizBook(id, quizBookDTO);
    return new EditQuizBookResponseDTO(editedQuizBook);
  }

  @Patch(':id/like')
  @UseGuards(new UserGuard())
  async updateQuizBookLikes(@Req() request:Request, @Param('id') id: number)
  : Promise<LikeQuizBookResponseDTO>{
    const userId = request.user.id;
    const likeResult = await this.quizBookService.updateQuizBookLikes(id, userId);

    return new LikeQuizBookResponseDTO(likeResult);
  }

  @Post(':id/solve')
  async solveQuiz(@Param('id') id: number){
    const userId = request.user.id;
    await this.quizBookService.solveQuiz(id, userId);
  
  }
}
