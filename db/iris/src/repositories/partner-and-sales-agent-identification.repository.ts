import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PartnerAndSalesAgentIdentification } from '../entities/PartnerAndSalesAgentIdentification.entity';

@Injectable()
export class PartnerAndSalesAgentIdentificationRepository {
  public constructor(
    @InjectRepository(PartnerAndSalesAgentIdentification, 'iris')
    private readonly repository: Repository<PartnerAndSalesAgentIdentification>
  ) {}

  /**
   * Find partner and sales agent information for a list of merchant IDs
   */
  public async findForMerchants(
    merchantIds: string[]
  ): Promise<PartnerAndSalesAgentIdentification[]> {
    if (!merchantIds.length) {
      return [];
    }

    return this.repository.createQueryBuilder('partner')
      .where('partner.merchantId IN (:...merchantIds)', { merchantIds })
      .getMany();
  }
} 