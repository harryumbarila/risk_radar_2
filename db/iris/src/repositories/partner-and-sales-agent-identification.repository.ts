import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { PartnerAndSalesAgentIdentificationEntity } from '../entities';

@Injectable()
export class PartnerAndSalesAgentIdentificationRepository extends Repository<PartnerAndSalesAgentIdentificationEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(PartnerAndSalesAgentIdentificationEntity, dataSource.createEntityManager());
  }
} 