import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as sanitizeHtml from 'sanitize-html';

import type { TemplateEngineInterface } from '@/api/shared/email/template-engine.interface';
import { TemplateType } from '@/api/shared/email/email-template-message';

Handlebars.registerHelper('sanitize', (aString: unknown) => {
  const clean = sanitizeHtml(String(aString ?? ''), {});

  return new Handlebars.SafeString(clean);
});

export class HandlebarsTemplateEngine implements TemplateEngineInterface {
  private templates = [
    'partner-invoice',
    'tsys-fiu-changed-file',
    'risk-radar-memo',
  ];
  public render(
    template: TemplateType,
    context: Record<string, string>
  ): string {
    for (const currentTemplate of this.templates) {
      if (template === currentTemplate) {
        const templatePath = path.resolve(
          __dirname,
          '../../..',
          'assets/templates/emails',
          `${currentTemplate}.hbs`
        );
        const templateSource = fs.readFileSync(templatePath, 'utf8');

        const handlebarTemplate = Handlebars.compile(templateSource);

        return handlebarTemplate(context);
      }
    }
    throw new Error('fail email generation');
  }
}
