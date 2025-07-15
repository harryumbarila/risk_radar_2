import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { SubscriptionQueueRequestEventJsonSourceEntity } from '../entities/subscription-queue-request-event-json-source.entity';

@Injectable()
export class SubscriptionQueueRequestEventJsonSourceRepository extends Repository<SubscriptionQueueRequestEventJsonSourceEntity> {
  public constructor(@InjectDataSource('iris') dataSource: DataSource) {
    super(
      SubscriptionQueueRequestEventJsonSourceEntity,
      dataSource.createEntityManager()
    );
  }

  /**
   * Check if UW New Account Hold is set, allowing risk to edit
   */
  public async checkUwNewAccountHoldAllowRiskToEdit(
    irisMid: string
  ): Promise<boolean> {
    const result = await this.createQueryBuilder()
      .select(['pk'])
      .where('IrisMId = :irisMid', { irisMid })
      .andWhere('dtUW_NewAccountHold_OnDivertCapturedInTalusDB IS NOT NULL')
      .andWhere('dtUW_NewAccountHold_OffDivertCapturedInTalusDB IS NULL')
      .getOne();
    return !result;
  }
}
