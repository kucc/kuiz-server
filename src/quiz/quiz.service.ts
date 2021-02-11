import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizEntity } from 'src/entity/quiz.entity';
import { Repository } from 'typeorm';
import { QuizResponseDTO } from './dto/quiz-response.dto';
import UpdateQuizRequestDTO from './dto/update-quiz-request.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(QuizEntity)
    public readonly QuizRepository: Repository<QuizEntity>,
  ) {}

  async findById(id: number): Promise<QuizEntity> {
    const quiz = await this.QuizRepository.findOne(id);
    if (!quiz) {
      throw new BadRequestException('존재하지 않는 문제입니다.');
    }
    return quiz;
  }

  async updateQuiz(
    quiz: QuizEntity,
    requestDTO: UpdateQuizRequestDTO,
  ): Promise<QuizResponseDTO> {
    const updatedQuiz = this.QuizRepository.merge(quiz, requestDTO);

    await this.QuizRepository.save(updatedQuiz).catch(() => {
      throw new BadRequestException('잘못된 요청입니다.');
    });

    return new QuizResponseDTO(updatedQuiz);
  }

  async deleteQuiz(quizId: number): Promise<{ result: boolean }> {
    const quiz = await this.findById(quizId);

    await this.QuizRepository.delete(quiz).catch(() => {
      throw new BadRequestException('잘못된 요청입니다.');
    });

    return { result: true };
  }
}
