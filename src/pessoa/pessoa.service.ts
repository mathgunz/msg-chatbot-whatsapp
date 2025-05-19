import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pessoa } from './pessoa.entity';

@Injectable()
export class PessoaService {
  constructor(
    @InjectRepository(Pessoa)
    private pessoaRepository: Repository<Pessoa>,
  ) {}

  create(data: Partial<Pessoa>): Promise<Pessoa> {
    const pessoa = this.pessoaRepository.create(data);
    return this.pessoaRepository.save(pessoa);
  }

  findAll(): Promise<Pessoa[]> {
    return this.pessoaRepository.find();
  }

  async findOne(id: number): Promise<Pessoa> {
    const pessoa = await this.pessoaRepository.findOneBy({ id });
    if (!pessoa) throw new NotFoundException('Pessoa não encontrada');
    return pessoa;
  }

  async update(id: number, data: Partial<Pessoa>): Promise<Pessoa> {
    await this.pessoaRepository.update(id, data);
    const updated = await this.pessoaRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException('Pessoa não encontrada');
    return updated;
  }

  async remove(id: number): Promise<void> {
    const result = await this.pessoaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Pessoa não encontrada');
    }
  }
}
