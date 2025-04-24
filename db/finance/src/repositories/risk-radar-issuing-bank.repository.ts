import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { MssqlParameter, Repository } from 'typeorm';

import { RiskRadarIssuingBank } from '../entities/risk-radar-issuing-banks.entity';

@Injectable()
export class RiskRadarIssuingBankRepository extends Repository<RiskRadarIssuingBank> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarIssuingBank, dataSource.createEntityManager());
  }
  
  /**
   * Find issuing bank by BIN with proper varchar casting
   */
  public async findByBin(bin: string): Promise<RiskRadarIssuingBank | null> {
    return this.createQueryBuilder('issuingBank')
      .where('issuingBank.bin = :bin', {
        bin: new MssqlParameter(bin, 'varchar', 8),
      })
      .getOne();
  }
}
