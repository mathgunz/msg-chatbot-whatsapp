import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('contexto_conversa')
export class ContextoConversa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  telefone: string;

  @Column({ nullable: true })
  profissional: string;

  @Column({ nullable: true })
  dataDesejada: string;

  @Column({ nullable: true })
  horarioDesejado: string;

  @Column({ nullable: true })
  procedimento: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}