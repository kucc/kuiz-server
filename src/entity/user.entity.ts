import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { QuizBookEntity } from './quiz-book.entity';
import { UserSolveQuizBookEntity } from './user-solve-quiz-book.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'int',
    default: 0,
  })
  point: number;

  @Column({
    type: 'int',
    default: 1,
  })
  level: number;

  @Column({
    type: 'tinyint',
    default: 0,
  })
  isMember: boolean;

  @OneToMany(() => QuizBookEntity, (quizBook) => quizBook.owner)
  quizBooks: QuizBookEntity[];

  @OneToMany(() => UserSolveQuizBookEntity, (solve) => solve.quizBook)
  solves: UserSolveQuizBookEntity[];
}
