
import { Injectable } from '@nestjs/common';
import { ContextoConversa } from '../entities/contexto-conversa.entity';

@Injectable()
export class AgendamentoService {
  agendar(contexto: ContextoConversa) {
    throw new Error('Method not implemented.');
  }
  async consultarHorariosDisponiveis(data: string, profissional: string): Promise<string[]> {
    // Simulação por enquanto (pode ser substituído pela chamada real via HTTP)
    console.log(`(Simulação) Buscando horários para ${profissional} no dia ${data}`);

    return [
      '09:00',
      '10:30',
      '13:00',
      '15:30',
    ];
  }
}