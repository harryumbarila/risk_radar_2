import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { In, Repository } from 'typeorm';

import { PartnerAndSalesAgentIdentification } from '../entities/partner-and-sales-agent-identification.entity';

@Injectable()
export class PartnerAndSalesAgentIdentificationRepository extends Repository<PartnerAndSalesAgentIdentification> {
  // export class LeadsBusinessInformationRepository extends Repository<PartnerAndSalesAgentIdentification> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(PartnerAndSalesAgentIdentification, dataSource.createEntityManager());
  }

  /**
   * Find partner and sales agent information for a list of merchant IDs
   */
  public async findForMerchants(
    merchantIds: string[]
  ): Promise<PartnerAndSalesAgentIdentification[]> {
    if (!merchantIds.length) {
      return [];
    }

    return this.find({
      where: {
        merchantId: In(merchantIds),
      },
    });
  }
}
