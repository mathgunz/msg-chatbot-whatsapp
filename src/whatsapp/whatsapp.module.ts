import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { ConfigService } from '@nestjs/config';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import { ContextoService } from 'src/contexto/contexto-conversa.service';
import { AgendamentoService } from 'src/contexto/agendamento/agendamento.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextoConversa } from 'src/contexto/entities/contexto-conversa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContextoConversa])],
  providers: [
    WhatsappService, 
    ConfigService, 
    OpenAiService,
    ContextoService,
    AgendamentoService,
  ],
  controllers: [WhatsappController],
})
export class WhatsappModule {}
