import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { In, MssqlParameter, Repository } from 'typeorm';

import { PartnerAndSalesAgentIdentificationEntity } from '../entities/partner-and-sales-agent-identification.entity';

@Injectable()
export class PartnerAndSalesAgentIdentificationRepository extends Repository<PartnerAndSalesAgentIdentificationEntity> {
  // export class LeadsBusinessInformationRepository extends Repository<PartnerAndSalesAgentIdentification> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(
      PartnerAndSalesAgentIdentificationEntity,
      dataSource.createEntityManager()
    );
  }

  /**
   * Find partner and sales agent information for a list of merchant IDs
   */
  public async findForMerchants(
    merchantIds: string[]
  ): Promise<PartnerAndSalesAgentIdentificationEntity[]> {
    if (!merchantIds.length) {
      return [];
    }

    return this.find({
      where: {
        mid: In(merchantIds),
      },
    });
  }

  /**
   * Find partner by merchant ID with proper varchar casting
   */
  public async findByMerchantId(
    merchantId: string
  ): Promise<PartnerAndSalesAgentIdentificationEntity | null> {
    return this.createQueryBuilder('partner')
      .where('partner.mid = :mid', {
        mid: new MssqlParameter(merchantId, 'varchar', 16),
      })
      .getOne();
  }
}
