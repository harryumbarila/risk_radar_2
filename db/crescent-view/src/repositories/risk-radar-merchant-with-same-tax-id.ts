import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { MerchantTIN } from '../entities/merchant-tin';

@Injectable()
export class RiskRadarMerchantTaxIdRepository extends Repository<MerchantTIN> {
  public constructor(
    @InjectDataSource('crescent-view') dataSource: DataSource
  ) {
    super(MerchantTIN, dataSource.createEntityManager());
  }

  /**
   * @migrated dbo.uspRiskRadarMerchantWithSameTaxID.StoredProcedure.sql
   */
  public async getMerchantWithSameTaxID(sMID: string): Promise<string[]> {
    const merchant = await this.createQueryBuilder('m')
      .select('m.sTIN')
      .where('m.sMID = :sMID', { sMID })
      .getOne();

    if (!merchant || !merchant.sTIN) {
      return [];
    }

    const merchants = await this.createQueryBuilder('m')
      .select('m.sMID, sMID')
      .where('m.sTIN = :sTIN', { sTIN: merchant.sTIN })
      .andWhere('m.sMID != :sMID', { sMID })
      .orderBy('m.sMID', 'ASC')
      .getRawMany();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return merchants.map((m) => m.sMID as unknown as string);
  }
}
