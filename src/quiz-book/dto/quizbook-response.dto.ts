import { CategoryEntity } from 'src/entity/category.entity';
import { QuizEntity } from 'src/entity/quiz.entity';
import { QuizBookEntity } from '../../entity/quiz-book.entity';

export class QuizBookListResponseDTO {
  constructor(quizBooks: QuizBookEntity[], count: number) {
    this.count = count;
    this.data = quizBooks.map((quizBook) => new QuizBookResponseDTO(quizBook));
  }
  readonly count: number;
  readonly data: QuizBookResponseDTO[];
}

export class QuizBookwithLikedResponseDTO {
  constructor(joined: any) {
    this.id = joined.id;
    this.title = joined.title;
    this.ownerId = joined.ownerId;
    this.ownerName = joined.ownerName;
    this.createdAt = joined.createdAt;
    this.categoryId = joined.categoryId;
    this.quizCount = joined.quizCount;
    this.solvedCount = joined.solvedCount;
    this.likedCount = joined.likedCount;
    this.liked = joined.liked === null ? false : joined.liked;
  }
  readonly id: number;
  readonly title: string;
  readonly ownerId: number;
  readonly ownerName: string;
  readonly createdAt: Date;
  readonly categoryId: number;
  readonly quizCount: number;
  readonly solvedCount: number;
  readonly likedCount: number;
  liked: boolean;
}
export class QuizBookResponseDTO {
  constructor(quizBook: QuizBookEntity) {
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

export class EditQuizBookResponseDTO {
  constructor(quizBook: QuizBookEntity) {
    this.id = quizBook.id;
    this.title = quizBook.title;
    this.categoryId = quizBook.categoryId;
  }
  readonly id: number;
  readonly title: string;
  readonly categoryId: number;
}

export class LikeQuizBookResponseDTO {
  constructor(id: number, likedCount: number, liked: boolean) {
    this.id = id;
    this.likedCount = likedCount;
    this.liked = liked;
  }
  readonly id: number;
  readonly likedCount: number;
  readonly liked: boolean;
}

export class QuizBookWithQuizResponseDTO {
  constructor(quizBook: QuizBookEntity) {
    this.id = quizBook.id;
    this.title = quizBook.title;
    this.ownerId = quizBook.ownerId;
    this.categoryId = quizBook.categoryId;
    this.completed = quizBook.completed;
    this.quiz = quizBook.quizs;
    this.category = quizBook.category;
  }
  readonly id: number;
  readonly title: string;
  readonly categoryId: number;
  readonly ownerId: number;
  readonly completed: boolean;
  readonly quiz: QuizEntity[];
  readonly category: CategoryEntity;
}

export class QuizBookWithSolvingQuizResponseDTO {
  constructor(quizBook: any) {
    this.id = quizBook.id;
    this.quizCount = quizBook.quizCount;
    this.lastQuizId = quizBook.lastQuizId;
    this.savedCorrectCount = quizBook.savedCorrectCount;
    this.savedQuizId = quizBook.savedQuizId;
    this.allSolved = quizBook.allSolved;
    this.updatedAt = quizBook.updatedAt;
    this.solvedAt = quizBook.solvedAt;
    this.quiz = quizBook.quiz;
  }
  readonly id: number;
  readonly quizCount: number;
  readonly lastQuizId: number;
  readonly savedCorrectCount: number | null;
  readonly savedQuizId: number;
  readonly allSolved: boolean;
  readonly updatedAt: Date;
  readonly solvedAt: Date;
  quiz: QuizEntity[];
}
