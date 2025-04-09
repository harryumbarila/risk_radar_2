import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { And, In, IsNull, MoreThan, Not, Repository } from 'typeorm';

import { RiskRadarExceptionsJeffEntity } from '../entities/risk-radar-exceptions-jeff.entity';

@Injectable()
export class RiskRadarExceptionsJeffRepository extends Repository<RiskRadarExceptionsJeffEntity> {
  public constructor(@InjectDataSource('finance') dataSource: DataSource) {
    super(RiskRadarExceptionsJeffEntity, dataSource.createEntityManager());
  }

  public async assignExceptions(
    exceptionIds: number[],
    assignedUserId: number
  ): Promise<void> {
    if (exceptionIds.length === 0) return;

    await this.update(
      { id: In(exceptionIds) },
      {
        assignedUserId,
        exceptionStatusId: 4,
      }
    );
  }

  public async getExceptionsByMIDs(
    exceptionIds: number[]
  ): Promise<Pick<RiskRadarExceptionsJeffEntity, 'id' | 'mid'>[]> {
    if (exceptionIds.length === 0) return [];

    return this.find({
      select: ['id', 'mid'],
      where: {
        id: In(exceptionIds),
        exceptionStatusId: 4,
      },
    });
  }

  /**
   * @migrated dbo.uspAssignRiskRadarExceptionsReview.StoredProcedure.sql
   */
  public async reviewExceptions(
    exceptionIds: number[],
    user: string
  ): Promise<void> {
    if (exceptionIds.length === 0) return;

    await this.update(
      {
        id: In(exceptionIds),
        exceptionStatusId: In([1, 2, 3, 4]),
      },
      {
        exceptionStatusId: 2,
        userReviewed: user,
      }
    );
  }

  public async getDistinctMIDsForReview(
    exceptionIds: number[]
  ): Promise<Pick<RiskRadarExceptionsJeffEntity, 'mid'>[]> {
    if (exceptionIds.length === 0) {
      return [];
    }

    const result = await this.find({
      select: ['mid'],
      where: { id: In(exceptionIds) },
    });

    // Manually remove duplicates since TypeORM `find()` doesn't support DISTINCT
    const uniqueMIDs = Array.from(new Set(result.map((r) => r.mid))).map(
      (mid) => ({ mid })
    );

    return uniqueMIDs;
  }

  // eslint-disable-next-line class-methods-use-this
  public getCategoriesFilter(
    category: string[]
  ): FindOptionsWhere<RiskRadarExceptionsJeffEntity>[] {
    const wheres: FindOptionsWhere<RiskRadarExceptionsJeffEntity>[] = [];

    category.forEach((c) => {
      switch (c) {
        case '1':
          // Note: amexOptBlueInd property doesn't exist in entity
          break;
        case '2':
          wheres.push({
            transactionsAboveLimit: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '3':
          wheres.push({
            authDeclines: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '4':
          wheres.push({
            averageBatch: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '5':
          wheres.push({
            chargebackOrIRR: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '6':
          wheres.push({ isDiverted: true });
          break;
        case '7':
          wheres.push({
            duplicateBins: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '8':
          wheres.push({
            duplicateCards: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '9':
          wheres.push({
            foreignKeyedTransactions: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '10':
          wheres.push({
            numberOfKeyedTransactionsAboveLimit: And(
              Not(IsNull()),
              MoreThan(0)
            ),
          });
          break;
        case '11':
          wheres.push({
            latePostTransactions: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '12':
          wheres.push({
            motoToIoAVS: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '13':
          wheres.push({
            batchVolumeAboveLimit: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '14':
          wheres.push({
            negativeDailyBatches: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '15':
          wheres.push({
            settlementBalance: And(Not(IsNull()), Not(0)),
          });
          break;
        case '16':
          wheres.push({ isNewAccount: true });
          break;
        case '17':
          wheres.push({ isNextDayFundingAccount: true });
          break;
        case '18':
          wheres.push({
            unauthorizedTransactions: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '19':
          wheres.push({ isRiskWatch: true });
          break;
        case '20':
          wheres.push({
            salesChannelRule: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '21':
          wheres.push({
            authCaptureAmountLargeVariation: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '22':
          wheres.push({
            autoHold: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '23':
          wheres.push({
            transactionsAboveHighTicketLimit: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '24':
          wheres.push({
            creditRule: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        case '25':
          wheres.push({
            fundingExclusionAndException: And(Not(IsNull()), MoreThan(0)),
          });
          break;
        default:
          break;
      }
    });

    return wheres;
  }

  // eslint-disable-next-line class-methods-use-this
  public applyCategoriesFilter2(
    query: SelectQueryBuilder<RiskRadarExceptionsJeffEntity>,
    category: string[]
  ): SelectQueryBuilder<RiskRadarExceptionsJeffEntity> {
    if (category.length > 0) {
      const orConditions: string[] = [];
      const parameters: Record<string, string | boolean> = {};

      category.forEach((c, index) => {
        switch (c) {
          case '1':
            // Check for AMEX OptBlue indicator 'Y' - requires join and exists
            orConditions.push(`
              EXISTS (
                SELECT TOP 1 1
                FROM tblRiskRadarBatch batch
                WHERE batch.sMID = exception.sMID 
                AND batch.sAMEXOptBlueInd = 'Y'
                ORDER BY batch.pkDFT256Batch DESC
              )
            `);
            break;
          case '2':
            orConditions.push(
              `exception.iTransAmtAboveLimit IS NOT NULL AND exception.iTransAmtAboveLimit > 0`
            );
            break;
          case '3':
            orConditions.push(
              `exception.iAuthDecline IS NOT NULL AND exception.iAuthDecline > 0`
            );
            break;
          case '4':
            orConditions.push(
              `exception.iAvgBatch IS NOT NULL AND exception.iAvgBatch > 0`
            );
            break;
          case '5':
            orConditions.push(
              `exception.iChbkOrIRR IS NOT NULL AND exception.iChbkOrIRR > 0`
            );
            break;
          case '6':
            orConditions.push(`
              EXISTS (
                SELECT 1 
                FROM tblRiskRadarMerchAdjParam p 
                WHERE p.sMID = exception.sMID AND p.bDivert = 1
              )
            `);
            break;
          case '7':
            orConditions.push(
              `exception.iDupBin IS NOT NULL AND exception.iDupBin > 0`
            );
            break;
          case '8':
            orConditions.push(
              `exception.iDupCard IS NOT NULL AND exception.iDupCard > 0`
            );
            break;
          case '9':
            orConditions.push(
              `exception.iFgnkeyedTrans IS NOT NULL AND exception.iFgnkeyedTrans > 0`
            );
            break;
          case '10':
            orConditions.push(
              `exception.iNumOfKeyedTransAboveLimit IS NOT NULL AND exception.iNumOfKeyedTransAboveLimit > 0`
            );
            break;
          case '11':
            orConditions.push(
              `exception.iLatePostTrans IS NOT NULL AND exception.iLatePostTrans > 0`
            );
            break;
          case '12':
            orConditions.push(
              `exception.iMototIoAVS IS NOT NULL AND exception.iMototIoAVS > 0`
            );
            break;
          case '13':
            orConditions.push(
              `exception.iBatchVolAboveLimit IS NOT NULL AND exception.iBatchVolAboveLimit > 0`
            );
            break;
          case '14':
            orConditions.push(`exception.iNegDailyBatches IS NOT NULL`);
            break;
          case '15':
            orConditions.push(
              `exception.dSettlementBalance IS NOT NULL AND exception.dSettlementBalance <> 0`
            );
            break;
          case '16':
            orConditions.push(`exception.bNewAcct = :isNewAccount${index}`);
            parameters[`isNewAccount${index}`] = true;
            break;
          case '17':
            orConditions.push(
              `exception.bNextDayFundingAcct = :isNextDayFundingAccount${index}`
            );
            parameters[`isNextDayFundingAccount${index}`] = true;
            break;
          case '18':
            orConditions.push(
              `exception.iNoAuthTrans IS NOT NULL AND exception.iNoAuthTrans > 0`
            );
            break;
          case '19':
            orConditions.push(`exception.bRiskWatch = :isRiskWatch${index}`);
            parameters[`isRiskWatch${index}`] = true;
            break;
          case '20':
            orConditions.push(
              `exception.iSalesChannelRule IS NOT NULL AND exception.iSalesChannelRule > 0`
            );
            break;
          case '21':
            orConditions.push(
              `exception.iAuthCaptureAmtLargeVariation IS NOT NULL AND exception.iAuthCaptureAmtLargeVariation > 0`
            );
            break;
          case '22':
            orConditions.push(
              `exception.iAutoHold IS NOT NULL AND exception.iAutoHold > 0`
            );
            break;
          case '23':
            orConditions.push(
              `exception.iTransAmtAboveHighTicketLimit IS NOT NULL AND exception.iTransAmtAboveHighTicketLimit > 0`
            );
            break;
          case '24':
            orConditions.push(
              `exception.iCreditRule IS NOT NULL AND exception.iCreditRule > 0`
            );
            break;
          case '25':
            orConditions.push(
              `exception.iFundingExclusionAndException IS NOT NULL AND exception.iFundingExclusionAndException > 0`
            );
            break;
          default:
            break;
        }
      });

      if (orConditions.length > 0) {
        query.andWhere(`(${orConditions.join(' OR ')})`, parameters);
      }
    }

    return query;
  }
}
