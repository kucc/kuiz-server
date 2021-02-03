import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quiz')
export class QuizEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 45,nullable: false})
  question:string;

  @Column({type: 'varchar', length: 45, nullable: false})
  answer:string;

  @Column({ type: 'varchar', length: 45, nullable: false})
  imageURL:string;

  @Column({type: 'varchar',length: 45, nullable: true})
  a1:string;

  @Column({type: 'varchar',length: 45, nullable: true})
  a2:string;

  @Column({type: 'varchar', length: 45, nullable: true})
  a3:string;

  @Column({type: 'varchar',length: 45, nullable: true})
  a4:string;

  @Column({type:'varchar', length: 255, nullable: true})
  description: string;

  @Column({type:'boolean'})
  isChoice: boolean;



}
