import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContextoConversa } from './entities/contexto-conversa.entity';
import { ContextoService } from './contexto-conversa.service';

@Module({
  imports: [TypeOrmModule.forFeature([ContextoConversa])],
  providers: [ContextoService],
  exports: [ContextoService],
})
export class ContextoConversaModule {}