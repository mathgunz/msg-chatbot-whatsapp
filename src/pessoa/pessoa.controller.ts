import { Controller, Get, Post, Body, Param, Put, Delete, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PessoaService } from './pessoa.service';
import { Pessoa } from './pessoa.entity';

@Controller('pessoas')
export class PessoaController {
  constructor(
    private readonly pessoaService: PessoaService,
    private readonly configService: ConfigService
  ) {
    // Exemplo: acessar a variável de ambiente OPENAI_API_KEY
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    console.log('OPENAI_API_KEY:', openaiKey);
  }

  @Post()
  create(@Body() data: Partial<Pessoa>): Promise<Pessoa> {
    return this.pessoaService.create(data);
  }

  @Get()
  findAll(): Promise<Pessoa[]> {
    return this.pessoaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Pessoa> {
    return this.pessoaService.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<Pessoa>): Promise<Pessoa> {
    return this.pessoaService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.pessoaService.remove(Number(id));
  }
}
