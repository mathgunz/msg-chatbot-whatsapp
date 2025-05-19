export class WebhookMessageDto {
  entry: {
    changes: {
      value: {
        messages: {
          from: string;
          text?: {
            body: string;
          };
        }[];
      };
    }[];
  }[];
}
