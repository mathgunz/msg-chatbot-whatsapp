import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  telefone: string;
}
