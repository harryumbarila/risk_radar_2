import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { RiskRadarEmailTemplateEntity } from '../entities/risk-radar-email-template.entity';

@Injectable()
export class RiskRadarEmailTemplateRepository extends Repository<RiskRadarEmailTemplateEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarEmailTemplateEntity, dataSource.createEntityManager());
  }

  /**
   * @migrated dbo.uspRiskRadarEMailTemplateList.StoredProcedure.sql
   */
  public async getActiveEmailTemplates(): Promise<
    Pick<RiskRadarEmailTemplateEntity, 'id' | 'templateName'>[]
  > {
    return this.find({
      select: ['id', 'templateName'],
      where: {
        isHidden: false,
      },
      order: { templateName: 'ASC' },
    });
  }
}
