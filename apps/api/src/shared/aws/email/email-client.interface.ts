import type { EmailMessage } from '@/api/shared/aws/email/email-message';
import type { EmailResponse } from '@/api/shared/aws/email/email-response';

export type EmailClientInterface = {
  send(email: EmailMessage): Promise<EmailResponse>;
};
