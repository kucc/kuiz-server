import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { QuizEntity } from "./quiz.entity";
import { UserEntity } from "./user.entity";
import { QuizBookEntity } from "./quiz-book.entity";

@Entity('userSolveQuizBook')
export class UserSolveQuizBookEntity{

  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'tinyint', default: false})
  completed: boolean;

  @Column({type:'tinyint', default: false})
  liked: boolean;

  @Column({type:'int', nullable:false})
  savedQuizId: number;

  @Column({type:'int', nullable:false})
  userId: number;

  @Column({type:'int', nullable:false})
  quizBookId: number;


  @ManyToOne(type=> QuizEntity, savedQuiz => savedQuiz.saves, {nullable:false})
  @JoinColumn({name:'savedQuizId', referencedColumnName: 'id'})
  savedQuiz: QuizEntity;
  
  @ManyToOne(type=> UserEntity, user => user.solves, {nullable:false})
  @JoinColumn({name:'userId', referencedColumnName: 'id'})
  user: UserEntity;

  @ManyToOne(type=> QuizBookEntity, quizBook => quizBook.solves , {nullable:false})
  @JoinColumn({name: 'quizBookId', referencedColumnName: 'id'})
  quizBook: QuizBookEntity;
}