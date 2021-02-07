import { join } from 'path';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuizBookEntity } from './quiz-book.entity';
import { UserSolveQuizBookEntity } from './user-solve-quiz-book.entity';

@Entity('quiz')
export class QuizEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 225,nullable: false})
  question:string;

  @Column({type: 'text', nullable: false})
  answer:string;

  @Column({ type: 'text', nullable: false})
  imageURL:string;

  @Column({type: 'text', nullable: true})
  option1:string;

  @Column({type: 'text', nullable: true})
  option2:string;

  @Column({type: 'text', nullable: true})
  option3:string;

  @Column({type: 'text', nullable: true})
  option4:string;

  @Column({type:'text', nullable: true})
  description: string;

  @Column({type:'tinyint', default: false})
  isChoice: boolean;

  @ManyToOne(type=> QuizBookEntity, quizBook => quizBook.quizs)
  @JoinColumn({name: 'quizBookId', referencedColumnName: 'id'})
  public quizBook: QuizBookEntity;

  @OneToMany(type=>UserSolveQuizBookEntity, save=>save.savedQuiz)
  public saves: UserSolveQuizBookEntity[];

}
