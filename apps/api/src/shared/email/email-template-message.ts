import { OmitType, PartialType } from '@nestjs/swagger';

import type { Attachment } from '@/api/shared/aws/email/email-message';
import { EmailMessage } from '@/api/shared/aws/email/email-message';

type TemplateType =
  | 'partner-invoice'
  | 'tsys-fiu-changed-file'
  | 'risk-radar-memo';

export class EmailTemplateMessage extends PartialType(
  OmitType(EmailMessage, ['body'] as const)
) {
  public template: TemplateType;

  public constructor(
    to: string[],
    subject: string,
    template: TemplateType,
    context: { [key: string]: unknown },
    attachments?: Attachment[],
    stringTemplate?: string
  ) {
    super();

    this.to = to;
    this.template = template;
    this.subject = subject;
    this.attachments = attachments;
    this.context = context;
    this.stringTemplate = stringTemplate;
  }
}
