import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { subWeeks, startOfDay, endOfDay } from 'date-fns';

import {
  AutoHoldExceptionSummary,
  AdfAutoHoldFileProcessed,
  AdfAuthData,
  DftAutoHoldFileProcessed,
} from '../entities';
import { DFT256Batch } from '@denali/finance-db';

@Injectable()
export class AutoHoldExceptionSummaryRepository extends Repository<AutoHoldExceptionSummary> {
  public constructor(@InjectDataSource('risk-radar') dataSource: DataSource) {
    super(AutoHoldExceptionSummary, dataSource.createEntityManager());
  }

  async findExceptionsWithPagination(
    startDate?: Date | string,
    endDate?: Date | string,
    page = 1,
    limit = 10
  ) {
    const today = new Date();
    const effectiveStart = startDate
      ? startOfDay(new Date(startDate))
      : startOfDay(subWeeks(today, 1));
    const effectiveEnd = endDate
      ? endOfDay(new Date(endDate))
      : endOfDay(today);

    const skip = (page - 1) * limit;

    const query = this.createQueryBuilder('a')
      .leftJoinAndSelect('a.source', 's')
      .where('a.createdAt BETWEEN :start AND :end', {
        start: effectiveStart,
        end: effectiveEnd,
      })
      .orderBy('a.createdAt', 'ASC')
      .addOrderBy('s.definition', 'ASC')
      .addOrderBy('a.dataSourceIdentifier', 'ASC')
      .addOrderBy('a.merchantId', 'ASC')
      .skip(skip)
      .take(limit);

    const [results, total] = await query.getManyAndCount();

    const mapped = results.map((a) => ({
      id: a.id,
      source: a.source ?? null,
      dataSourceIdentifier: a.dataSourceIdentifier,
      merchantId: a.merchantId,
      NXDY: a.isNextDay ? 'Yes' : null,
      AH001: a.isAutoHold01 ? 'Yes' : null,
      AH002: a.isAutoHold02 ? 'Yes' : null,
      AH003: a.isAutoHold03 ? 'Yes' : null,
      AH004: a.isAutoHold04 ? 'Yes' : null,
      AH005: a.isAutoHold05 ? 'Yes' : null,
      AH006: a.isAutoHold06 ? 'Yes' : null,
      AH007: a.isAutoHold07 ? 'Yes' : null,
      AH008: a.isAutoHold08 ? 'Yes' : null,
      AH009: a.isAutoHold09 ? 'Yes' : null,
      AH010: a.isAutoHold10 ? 'Yes' : null,
      AH011: a.isAutoHold11 ? 'Yes' : null,
      AH012: a.isAutoHold12 ? 'Yes' : null,
      AH013: a.isAutoHold13 ? 'Yes' : null,
      AH014: a.isAutoHold14 ? 'Yes' : null,
      AH015: a.isAutoHold15 ? 'Yes' : null,
      AH016: a.isAutoHold16 ? 'Yes' : null,
      createdAt: a.createdAt,
    }));

    return {
      data: mapped,
      count: mapped.length,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async getAutoHoldStats() {
    const adfTotalSubQuery = this.createQueryBuilder('a')
      .innerJoin(
        AdfAutoHoldFileProcessed,
        'b',
        'b.pk = a.fk_adf_auto_hold_file_processed'
      )
      .innerJoin(AdfAuthData, 'c', 'c.FileId = b.file_id')
      .select('COUNT(DISTINCT c.MId)', 'MIds_adf_total');

    // Subquery for MIds_dft_total
    const dftTotalSubQuery = this.createQueryBuilder('a')
      .innerJoin(
        DftAutoHoldFileProcessed,
        'b',
        'b.pk = a.fk_dft_auto_hold_file_processed'
      )
      .innerJoin(
        DFT256Batch,
        'c',
        `
          c.dtTransmission = b.dtTransmission
          AND c.iTransmissionNum = b.iTransmissionNum
          AND c.iBatchNum = b.iBatchNum
        `
      )
      .select('COUNT(DISTINCT c.sMId)', 'MIds_dft_total');

    const query = this.createQueryBuilder('a')
      .select([
        `(${adfTotalSubQuery.getQuery()}) AS "MIds_adf_total"`,
        `(${dftTotalSubQuery.getQuery()}) AS "MIds_dft_total"`,
        `COUNT(DISTINCT CASE WHEN a.AH001 = 1 THEN a.MId END) AS "AH01_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH002 = 1 THEN a.MId END) AS "AH02_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH003 = 1 THEN a.MId END) AS "AH03_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH004 = 1 THEN a.MId END) AS "AH04_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH005 = 1 THEN a.MId END) AS "AH05_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH006 = 1 THEN a.MId END) AS "AH06_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH007 = 1 THEN a.MId END) AS "AH07_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH010 = 1 THEN a.MId END) AS "AH10_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH011 = 1 THEN a.MId END) AS "AH11_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH012 = 1 THEN a.MId END) AS "AH12_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH014 = 1 THEN a.MId END) AS "AH14_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH015 = 1 THEN a.MId END) AS "AH15_MIds_Impacted"`,
        `COUNT(DISTINCT CASE WHEN a.AH016 = 1 THEN a.MId END) AS "AH16_MIds_Impacted"`,
      ])
      .setParameters({
        ...adfTotalSubQuery.getParameters(),
        ...dftTotalSubQuery.getParameters(),
      });

    const result = await query.getRawOne();

    // Return formatted result with proper null handling
    return {
      midsAdfTotal: result?.MIds_adf_total || 0,
      midsDftTotal: result?.MIds_dft_total || 0,
      ah01MidsImpacted: result?.AH01_MIds_Impacted || 0,
      ah02MidsImpacted: result?.AH02_MIds_Impacted || 0,
      ah03MidsImpacted: result?.AH03_MIds_Impacted || 0,
      ah04MidsImpacted: result?.AH04_MIds_Impacted || 0,
      ah05MidsImpacted: result?.AH05_MIds_Impacted || 0,
      ah06MidsImpacted: result?.AH06_MIds_Impacted || 0,
      ah07MidsImpacted: result?.AH07_MIds_Impacted || 0,
      ah10MidsImpacted: result?.AH10_MIds_Impacted || 0,
      ah11MidsImpacted: result?.AH11_MIds_Impacted || 0,
      ah12MidsImpacted: result?.AH12_MIds_Impacted || 0,
      ah14MidsImpacted: result?.AH14_MIds_Impacted || 0,
      ah15MidsImpacted: result?.AH15_MIds_Impacted || 0,
      ah16MidsImpacted: result?.AH16_MIds_Impacted || 0,
    };
  }
}
