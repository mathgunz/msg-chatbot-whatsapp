// src/open-ai/open-ai.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  public async chat(messages: ChatCompletionMessageParam[]) {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
    });

    return response.choices[0].message?.content ?? 'Desculpe, não entendi.';
  }
}
