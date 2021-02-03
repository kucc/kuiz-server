import { Column, Entity,  PrimaryGeneratedColumn } from "typeorm";

@Entity('quiz_book')
export class QuizBookEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'varchar', length:45, nullable:false})
  title: string;

  @Column({type:'varchar', length:45, nullable:false})
  owner_name: string;

  @Column({type:'int', default: 0})
  count: number;

  @Column({type: 'datetime', default:'CURRENT_TIMESTAMP'})
  createdAt: Date;
}