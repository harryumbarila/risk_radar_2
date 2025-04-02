import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import type { RiskRadarEmailTemplateEntity } from '@/finance-db/entities/risk-radar-email-template.entity';
import { RiskRadarEmailTemplateRepository } from '@/finance-db/repositories';

@Injectable()
export class RiskRadarEmailTemplateService {
  public constructor(
    @InjectPinoLogger(RiskRadarEmailTemplateService.name)
    private readonly logger: Logger,
    private readonly emailTemplateRepository: RiskRadarEmailTemplateRepository
  ) {}

  /**
   * Get all active email templates
   * @returns List of active email templates with id and templateName
   */
  public async getActiveEmailTemplates(): Promise<
    Pick<RiskRadarEmailTemplateEntity, 'id' | 'templateName'>[]
  > {
    try {
      this.logger.info('Getting active email templates');
      const templates =
        await this.emailTemplateRepository.getActiveEmailTemplates();
      this.logger.info(
        { count: templates.length },
        'Successfully retrieved active email templates'
      );
      return templates;
    } catch (error: unknown) {
      this.logger.error({ error }, 'Error retrieving active email templates');
      throw error;
    }
  }
}
