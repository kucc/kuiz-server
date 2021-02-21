import { QuizEntity } from 'src/entity/quiz.entity';

export class QuizResponseDTO {
  public constructor(quiz: QuizEntity) {
    this.id = quiz.id;
    this.quizBookId = quiz.quizBookId;
    this.question = quiz.question;
    this.answer = quiz.answer;
    this.imageURL = quiz.imageURL;
    this.option1 = quiz.option1;
    this.option2 = quiz.option2;
    this.option3 = quiz.option3;
    this.option4 = quiz.option4;
    this.description = quiz.description;
    this.isChoice = quiz.isChoice;
  }
  public readonly id: number;
  public readonly quizBookId: number;
  public readonly question: string;
  public readonly answer: string;
  public readonly imageURL: string;
  public readonly option1: string;
  public readonly option2: string;
  public readonly option3: string;
  public readonly option4: string;
  public readonly description: string;
  public readonly isChoice: boolean;
}
