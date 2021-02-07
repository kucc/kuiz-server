import { Column, Entity,  JoinColumn,  ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity } from "./category";
import { QuizEntity } from "./quiz.entity";
import { UserSolveQuizBookEntity } from "./user-solve-quiz-book.entity";
import { UserEntity } from "./user.entity";

@Entity('quizBook')
export class QuizBookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar', length:45, nullable:false})
  title: string;

  @Column({type:'varchar', length:45, nullable:false})
  ownerName: string;

  @Column({type:'int', default: 0})
  quizCount: number;

  @Column({type:'int', default: 0})
  solvedCount: number;

  //수정
  @Column({type: 'timestamp', default:'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({type: 'int', default:0})
  likeCount: number;

  @Column({type: 'tinyint', default: false})
  completed: boolean;

  @ManyToOne(type=> CategoryEntity, category => category.quizBooks)
  @JoinColumn({name: 'categoryId',referencedColumnName: 'id'})
  public category: CategoryEntity;

  @ManyToOne(type => UserEntity, user => user.quizBooks)
  @JoinColumn({name: 'ownerId',referencedColumnName: 'id'})
  public owner: UserEntity;

  @OneToMany(type=>QuizEntity, quiz => quiz.quizBook)
  public quizs: QuizEntity[];

  @OneToMany(type=> UserSolveQuizBookEntity, solve => solve.quizBook)
  public solves: UserSolveQuizBookEntity[];
}