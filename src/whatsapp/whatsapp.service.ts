import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAiService } from 'src/open-ai/open-ai.service';
import axios from 'axios';
import { WebhookMessageDto } from './whatsapp.controller';
import { ContextoService } from 'src/contexto/contexto-conversa.service';
import { AgendamentoService } from 'src/contexto/agendamento/agendamento.service';

@Injectable()
export class WhatsappService {

  private funcaoSystem: string = 'Você é um assistente para agendamento de podologia. ' +
    'Seja claro, cordial e pergunte dia, profissional, procedimento e horário. ';

  private perguntasParaObterContexto: string = 'Se o cliente não tiver informado o dia, responda com "Olá! Qual dia você deseja o atendimento?". ' +
    'Se o cliente não tiver informado o profissional, responda com "Perfeito! Qual o nome da profissional desejada?". ' +
    'Se o cliente não tiver informado o horário, responda com "Ótimo! Você deseja agendar com {nome da profissional} no dia {dia}. Qual o horário desejado?". ' +
    'Se o cliente não tiver informado nenhuma das informações, responda com "Desculpe, não entendi. Por favor, me informe o dia, profissional, procedimento e horário desejados.". ' +
    'Se o cliente tiver informado o dia, profissional e horário e procedimento, responda com "Perfeito! Vou verificar a disponibilidade. Aguarde...". ';

  private funcaoInternal: string = 'Preciso que a partir da mensagem do cliente identifique se ele enviou o ' +
    'HORARIO OU DATA OU NOME DA PROFISSIONAL e responda via JSON essas informações ' +
    'ex:{ "dataDesejada": "yyyy-mm-dd", "profissional":"Exemplo", "horarioDesejado":"hh:mm", "procedimento":"Exemplo"}. ' +
    'para que eu armazene no sistema essas informações. se o cliente não enviar, retorne com null.';

  constructor(
    private readonly configService: ConfigService,
    private readonly openAiService: OpenAiService,
    private readonly contextoService: ContextoService,
    private readonly agendamentoService: AgendamentoService
  ) {
    const openaiKey = this.configService.get<string>('OPENAI_API_KEY');
    console.log('OPENAI_API_KEY:', openaiKey);
    const whatsappKey = this.configService.get<string>('WHATSAPP_API_KEY');
    console.log('WHATSAPP_API_KEY:', whatsappKey);
  }

  public async handleIncomingMessage(body: WebhookMessageDto) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) return;

    const telefone = message.from; // número do cliente (ex: 5511999999999)
    const text = message.text?.body;

    if (!text) return;

    let contexto = await this.contextoService.obterPorTelefone(telefone);

    if (!contexto) {

      console.log(`Mensagem recebida de ${telefone}: ${text}`);

      // Envia a mensagem para o ChatGPT
      const respostaCliente: string = await this.openAiService.chat([
        {
          role: 'system',
          content: this.funcaoSystem +
            this.perguntasParaObterContexto
        },
        {
          role: 'user',
          content: text,
        },
      ]);

      console.log(`Resposta do ChatGPT: ${respostaCliente}`);

      // Envia a resposta para o WhatsApp
      await this.sendWhatsappMessage(telefone, respostaCliente);

      const respostaInterna: any = await this.openAiService.chat([
        {
          role: 'system',
          content: this.funcaoInternal,
        },
        {
          role: 'user',
          content: text,
        },
      ]);

      console.log(`Resposta do ChatGPT: ${respostaInterna}`);

      const jsonCliente = JSON.parse(respostaInterna);

      console.log(jsonCliente);

      var status = 'EM_ANDAMENTO';
      if (jsonCliente.dataDesejada && jsonCliente.profissional && jsonCliente.horarioDesejado && jsonCliente.procedimento) {
        status = 'CONCLUIDO';
      }

      contexto = await this.contextoService.salvarOuAtualizar({
        telefone,
        status,
        dataDesejada: jsonCliente.dataDesejada ?? null,
        profissional: jsonCliente.profissional ?? null,
        horarioDesejado: jsonCliente.horarioDesejado ?? null,
      });

      if (status === 'CONCLUIDO') {
        //verificar disponibilidade
        //se ttudo certo, agendar
        //se não, enviar mensagem de erro
      }
    }

    if (contexto.status === 'EM_ANDAMENTO') {
      
      const respostaCliente: string = await this.openAiService.chat([
        {
          role: 'system',
          content: 
            `Considerando que o cliente já iniciou uma conversa e informou {${contexto.dataDesejada != null ? 'dataDesejada, ' : ''} ${contexto.profissional != null ? 'profissional, ' : ''} ${contexto.horarioDesejado != null ? 'horarioDesejado, ' : ''} ${contexto.procedimento != null ? 'procedimento' : ''}}. preciso que continue o agendamento pedindo as informações que faltaram. ` +
            this.funcaoSystem +
            this.perguntasParaObterContexto
        },
        {
          role: 'user',
          content: text,
        },
      ]);
      
      console.log(respostaCliente);
    }
  }

  private async sendWhatsappMessage(to: string, message: string) {
    const url = `https://graph.facebook.com/v19.0/${this.configService.get<string>('PHONE_NUMBER_ID')}/messages`;

    await axios.post(
      url,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body: message },
      },
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('WHATSAPP_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
