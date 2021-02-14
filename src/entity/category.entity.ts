import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { QuizBookEntity } from './quiz-book.entity';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
  topic: string;

  @OneToMany((type) => QuizBookEntity, (quizBook) => quizBook.category)
  quizBooks: QuizBookEntity[];
}
