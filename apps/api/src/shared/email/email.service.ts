import { Inject } from '@nestjs/common';

import { EmailClientSymbolToken } from '@/api/shared/aws/email/email.constant';
import { EmailClientInterface } from '@/api/shared/aws/email/email-client.interface';
import type { EmailMessage } from '@/api/shared/aws/email/email-message';
import type { EmailResponse } from '@/api/shared/aws/email/email-response';
import { TemplateEngineSymbolToken } from '@/api/shared/email/template-engine.constant';
import { TemplateEngineInterface } from '@/api/shared/email/template-engine.interface';

import type { EmailTemplateMessage } from './email-template-message';

export class EmailService {
  public constructor(
    @Inject(EmailClientSymbolToken)
    private readonly emailClient: EmailClientInterface,
    @Inject(TemplateEngineSymbolToken)
    private readonly templateEngine: TemplateEngineInterface
  ) {}

  public async send(dto: EmailTemplateMessage): Promise<EmailResponse> {
    const emailMessage: EmailMessage = {
      to: dto.to,
      cc: dto.cc,
      sender: dto.sender,
      subject: dto.subject,
      body: dto.stringTemplate || '',
      context: dto.context,
      attachments: dto.attachments,
      stringTemplate: dto.stringTemplate,
    };

    if (!dto.stringTemplate) {
      const html = this.templateEngine.render(dto.template, dto.context);
      emailMessage.body = html;
    }

    return this.emailClient.send(emailMessage);
  }
}
