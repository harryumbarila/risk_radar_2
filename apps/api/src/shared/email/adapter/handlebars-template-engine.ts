import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

import type { TemplateEngineInterface } from '@/api/shared/email/template-engine.interface';

export class HandlebarsTemplateEngine implements TemplateEngineInterface {
  public render(template: string, context: Record<string, string>): string {
    const templatePath = path.resolve(
      __dirname,
      '../../..',
      'assets/templates/emails',
      `${template}.hbs`
    );
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const handlebarTemplate = Handlebars.compile(templateSource);

    return handlebarTemplate(context);
  }
}
