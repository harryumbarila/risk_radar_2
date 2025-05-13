import { Module } from '@nestjs/common';

import { EmailClientSymbolToken } from '@/api/shared/aws/email/email.constant';
import { AwsSesClient } from '@/api/shared/aws/email/ses.client';
import { HandlebarsTemplateEngine } from '@/api/shared/email/adapter/handlebars-template-engine';
import { TemplateEngineSymbolToken } from '@/api/shared/email/template-engine.constant';

import { EmailService } from './email.service';

@Module({
  providers: [
    EmailService,
    {
      provide: EmailClientSymbolToken,
      useClass: AwsSesClient,
    },
    {
      provide: TemplateEngineSymbolToken,
      useClass: HandlebarsTemplateEngine,
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
