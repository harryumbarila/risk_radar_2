import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';
import { IsNull, Not, Repository } from 'typeorm';

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
    const result = await this.findOne({
      where: {
        irisMId: irisMid,
        uwNewAccountHoldOnDivertCapturedInTalusDBDate: Not(IsNull()),
        uwNewAccountHoldOffDivertCapturedInTalusDBDate: IsNull(),
      },
    });

    // If record exists matching criteria, risk is NOT allowed to edit (return false)
    // If no matching record, risk IS allowed to edit (return true)
    return !result;
  }
}
