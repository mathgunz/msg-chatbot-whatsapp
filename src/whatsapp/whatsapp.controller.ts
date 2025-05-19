import { Controller, Get, Post, Body, Query, HttpCode } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WebhookMessageDto } from '../whatsapp/dtos/webhook-message.dto';

@Controller('whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService
  ) {
  }
  
  @Get('verify-token')
  verifyToken(
    @Query('hub.mode') mode: string,
    @Query('hub.verify_token') token: string,
    @Query('hub.challenge') challenge: string,
  ) {
    return { challenge: challenge };
  }

  @Post()
  @HttpCode(200)
  public async handleMessage(@Body() body: WebhookMessageDto): Promise<void> {
    await this.whatsappService.handleIncomingMessage(body);
  }
}
export { WebhookMessageDto };

