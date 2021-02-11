import { QuizBookEntity } from "../../entity/quiz-book.entity";

export class QuizBookResponseDTO{
  constructor(quizBook: QuizBookEntity){
    this.id = quizBook.id;
    this.title = quizBook.title;
    this.ownerName = quizBook.ownerName;
    this.createdAt = quizBook.createdAt;
    this.ownerId = quizBook.ownerId;
    this.categoryId = quizBook.categoryId;
  }
  readonly id: number;
  readonly title: string;
  readonly ownerName: string;
  readonly createdAt: Date;
  readonly categoryId: number;
  readonly ownerId: number;
}

export class EditQuizBookResponseDTO{
  constructor(quizBook: QuizBookEntity){
    this.id = quizBook.id;
    this.title = quizBook.title;
    this.categoryId = quizBook.categoryId;
  }
  readonly id: number;
  readonly title: string;
  readonly categoryId: number;
}

export class LikeQuizBookResponseDTO{
  constructor(quizBook: QuizBookEntity){
    this.id = quizBook.id;
    this.likedCount = quizBook.likedCount;
  }
  readonly id: number;
  readonly likedCount: number;
}