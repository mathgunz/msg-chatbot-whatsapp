import { Injectable } from '@nestjs/common';
import { ContextoConversa } from './entities/contexto-conversa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ContextoService {
  constructor(
    @InjectRepository(ContextoConversa)
    private readonly repo: Repository<ContextoConversa>,
  ) {}

  public async obterPorTelefone(telefone: string): Promise<ContextoConversa | null> {
    return this.repo.findOne({ where: { telefone } });
  }

  public async salvarOuAtualizar(dados: Partial<ContextoConversa>): Promise<ContextoConversa> {
    let contexto = await this.obterPorTelefone(dados.telefone!);

    if (!contexto) {
      contexto = this.repo.create(dados);
    } else {
      contexto = this.repo.merge(contexto, dados);
    }

    return this.repo.save(contexto);
  }

  public async limpar(telefone: string): Promise<void> {
    await this.repo.delete({ telefone });
  }
}
