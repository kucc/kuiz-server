import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { QuizEntity } from './quiz.entity';
import { UserEntity } from './user.entity';
import { CategoryEntity } from './category.entity';
import { UserSolveQuizBookEntity } from './user-solve-quiz-book.entity';

@Entity('quizBook')
export class QuizBookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
  ownerName: string;

  @Column({ type: 'int', default: 0 })
  quizCount: number;

  @Column({ type: 'int', default: 0 })
  solvedCount: number;

  //수정
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'tinyint', default: false })
  completed: boolean;

  @ManyToOne((type) => CategoryEntity, (category) => category.quizBooks)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category: CategoryEntity;

  @ManyToOne((type) => UserEntity, (user) => user.quizBooks)
  @JoinColumn({ name: 'ownerId', referencedColumnName: 'id' })
  owner: UserEntity;

  @OneToMany(() => QuizEntity, (quiz) => quiz.quizBookId)
  quizs: QuizEntity[];

  @OneToMany((type) => UserSolveQuizBookEntity, (solve) => solve.quizBook)
  solves: UserSolveQuizBookEntity[];
}
