import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RiskRadarEMailTemplateEntity } from '../entities/risk-radar-email-template.entity';

@Injectable()
export class RiskRadarEMailTemplateRepository extends Repository<RiskRadarEMailTemplateEntity> {
  constructor(dataSource: DataSource) {
    super(RiskRadarEMailTemplateEntity, dataSource.createEntityManager());
  }

  /**
   * @migrated dbo.uspRiskRadarEMailTemplateList.StoredProcedure.sql
   */
  async getActiveEmailTemplates(): Promise<
    Pick<RiskRadarEMailTemplateEntity, 'id' | 'templateName'>[]
  > {
    return this.createQueryBuilder('template')
      .select(['template.id', 'template.templateName'])
      .where('template.isHidden = :isHidden', { isHidden: false })
      .orderBy('template.templateName', 'ASC')
      .getMany();
  }
}
