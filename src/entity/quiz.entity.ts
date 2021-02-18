import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { QuizBookEntity } from './quiz-book.entity';

@Entity('quiz')
export class QuizEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 225, nullable: false })
  question: string;

  @Column({ type: 'text', nullable: false })
  answer: string;

  @Column({ type: 'text', nullable: false })
  imageURL: string;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'text', nullable: true })
  option1: string;

  @Column({ type: 'text', nullable: true })
  option2: string;

  @Column({ type: 'text', nullable: true })
  option3: string;

  @Column({ type: 'text', nullable: true })
  option4: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'tinyint', default: false })
  isChoice: boolean;

  @Column({ type: 'int', nullable: true })
  quizBookId: number;

  @ManyToOne((type) => QuizBookEntity, (quizBook) => quizBook.quizs)
  @JoinColumn({ name: 'quizBookId', referencedColumnName: 'id' })
  quizBook: QuizBookEntity;
}
