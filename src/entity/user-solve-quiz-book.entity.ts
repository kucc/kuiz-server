import { join } from "path";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { QuizBookController } from "../quiz-book/quiz-book.controller";
import { QuizBookEntity } from "./quiz-book.entity";
import { QuizEntity } from "./quiz.entity";
import { UserEntity } from "./user.entity";

@Entity('userSolveQuizBook')
export class UserSolveQuizBookEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'tinyint', default: false})
  completed: boolean;

  @Column({type:'tinyint', default: false})
  liked: boolean;

  @ManyToOne(type=> QuizEntity, savedQuiz => savedQuiz.saves)
  @JoinColumn({name:'savedQuizId', referencedColumnName: 'id'})
  public savedQuiz: QuizEntity;
  
  @ManyToOne(type=> UserEntity, user => user.solves)
  @JoinColumn({name:'userId', referencedColumnName: 'id'})
  public user: UserEntity;

  @ManyToOne(type=> QuizBookEntity, quizBook => quizBook.solves)
  @JoinColumn({name: 'quizBookId', referencedColumnName: 'id'})
  public quizBook: QuizBookEntity;
}