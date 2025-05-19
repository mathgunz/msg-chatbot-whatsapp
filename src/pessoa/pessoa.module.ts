import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './pessoa.entity';
import { PessoaService } from './pessoa.service';
import { PessoaController } from './pessoa.controller';
import { ConfigService } from '@nestjs/config';
import { OpenAiService } from 'src/open-ai/open-ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pessoa])],
  providers: [PessoaService, ConfigService, OpenAiService],
  controllers: [PessoaController],
})
export class PessoaModule {}
