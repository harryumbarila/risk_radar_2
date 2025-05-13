import type {
  SendEmailCommandOutput,
  SESClientConfig,
} from '@aws-sdk/client-ses';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { EmailClientInterface } from '@/api/shared/aws/email/email-client.interface';
import type { EmailMessage } from '@/api/shared/aws/email/email-message';
import type { EmailResponse } from '@/api/shared/aws/email/email-response';

export type AWSSesClientConfig = {
  NODE_ENV: string;
  AWS_REGION: string;
  AWS_SES_SENDER_EMAIL_ADDRESS: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_ENDPOINT: string;
};

@Injectable()
// eslint-disable-next-line @darraghor/nestjs-typed/injectable-should-be-provided
export class AwsSesClient implements EmailClientInterface {
  public constructor(
    private readonly configService: ConfigService<AWSSesClientConfig>
  ) {}

  public async send(email: EmailMessage): Promise<EmailResponse> {
    const createSendEmailCommand = (
      toAddress: string[],
      fromAddress: string
    ) => {
      return new SendEmailCommand({
        Destination: {
          ToAddresses: toAddress,
        },
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: 'UTF-8',
              Data: email.body,
            },
          },
          Subject: {
            Charset: 'UTF-8',
            Data: email.subject,
          },
        },
        Source: fromAddress,
        ReplyToAddresses: [
          this.configService.get('AWS_SES_SENDER_EMAIL_ADDRESS'),
        ],
      });
    };

    const run = async () => {
      const sendEmailCommand = createSendEmailCommand(
        email.to,
        this.configService.get('AWS_SES_SENDER_EMAIL_ADDRESS')
      );

      const prodConfig: SESClientConfig = {
        region: this.configService.get('AWS_REGION') || 'us-west-2',
      };

      const devConfig: SESClientConfig = {
        region: this.configService.get('AWS_REGION') || 'us-west-2',
        // endpoint: this.configService.get('AWS_ENDPOINT'),
      };

      try {
        const sesClient = new SESClient(
          this.configService.get('NODE_ENV') === 'development'
            ? devConfig
            : prodConfig
        );
        return await sesClient.send(sendEmailCommand);
      } catch (caught) {
        if (caught instanceof Error && caught.name === 'MessageRejected') {
          return caught;
        }

        throw caught;
      }
    };

    const response: SendEmailCommandOutput | Error = await run();

    return 'MessageId' in response
      ? { status: 'sent' }
      : { status: 'failed_to_send', error: response.message };
  }
}
