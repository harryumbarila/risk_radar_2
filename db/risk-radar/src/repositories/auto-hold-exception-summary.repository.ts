import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import type { DataSource } from 'typeorm';
import { Repository } from 'typeorm';

import { subWeeks, startOfDay, endOfDay } from 'date-fns';

import { AutoHoldExceptionSummary } from '../entities';

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
    // This query aggregates statistics from auto hold exception summary
    // It joins with ADF and DFT file processing data to get total MIDs,
    // then counts distinct MIDs impacted by each auto hold flag
    const query = `
      declare @MIds_adf_total int, @MIds_dft_total int

      select 
        @MIds_adf_total = count(distinct c.MId)
      from
        RiskRadar..tbl_auto_hold_exception_summary a
        join RiskRadar.[TSYS].[tbl_adf_auto_hold_file_processed] b on b.pk = a.fk_adf_auto_hold_file_processed
        join RiskRadar.[TSYS].[tbl_adf_auth_data] c on c.FileId = b.file_id

      select 
        @MIds_dft_total = count(distinct c.sMId)
      from
        RiskRadar..tbl_auto_hold_exception_summary a
        join RiskRadar.[TSYS].[tbl_dft_auto_hold_file_processed] b on b.pk = a.fk_dft_auto_hold_file_processed
        join finance..tblDFT256Batch c on c.dtTransmission = b.dtTransmission and
                          c.iTransmissionNum = b.iTransmissionNum and
                          c.iBatchNum = b.iBatchNum

      select 
        @MIds_adf_total as MIds_adf_total,
        @MIds_dft_total as MIds_dft_total,
        count(distinct case when AH001 = 1 then MId end) as AH01_MIds_Impacted,
        count(distinct case when AH002 = 1 then MId end) as AH02_MIds_Impacted,
        count(distinct case when AH003 = 1 then MId end) as AH03_MIds_Impacted,
        count(distinct case when AH004 = 1 then MId end) as AH04_MIds_Impacted,
        count(distinct case when AH005 = 1 then MId end) as AH05_MIds_Impacted,
        count(distinct case when AH006 = 1 then MId end) as AH06_MIds_Impacted,
        count(distinct case when AH007 = 1 then MId end) as AH07_MIds_Impacted,
        count(distinct case when AH010 = 1 then MId end) as AH10_MIds_Impacted,
        count(distinct case when AH011 = 1 then MId end) as AH11_MIds_Impacted,
        count(distinct case when AH012 = 1 then MId end) as AH12_MIds_Impacted,
        count(distinct case when AH014 = 1 then MId end) as AH14_MIds_Impacted,
        count(distinct case when AH015 = 1 then MId end) as AH15_MIds_Impacted,
        count(distinct case when AH016 = 1 then MId end) as AH16_MIds_Impacted
      from
        RiskRadar..tbl_auto_hold_exception_summary
    `;

    const result = await this.manager.query(query);

    // The query returns an array with one result object
    if (result && result.length > 0) {
      const stats = result[0];
      return {
        midsAdfTotal: stats.MIds_adf_total || 0,
        midsDftTotal: stats.MIds_dft_total || 0,
        ah01MidsImpacted: stats.AH01_MIds_Impacted || 0,
        ah02MidsImpacted: stats.AH02_MIds_Impacted || 0,
        ah03MidsImpacted: stats.AH03_MIds_Impacted || 0,
        ah04MidsImpacted: stats.AH04_MIds_Impacted || 0,
        ah05MidsImpacted: stats.AH05_MIds_Impacted || 0,
        ah06MidsImpacted: stats.AH06_MIds_Impacted || 0,
        ah07MidsImpacted: stats.AH07_MIds_Impacted || 0,
        ah10MidsImpacted: stats.AH10_MIds_Impacted || 0,
        ah11MidsImpacted: stats.AH11_MIds_Impacted || 0,
        ah12MidsImpacted: stats.AH12_MIds_Impacted || 0,
        ah14MidsImpacted: stats.AH14_MIds_Impacted || 0,
        ah15MidsImpacted: stats.AH15_MIds_Impacted || 0,
        ah16MidsImpacted: stats.AH16_MIds_Impacted || 0,
      };
    }

    // Return zeros if no data
    return {
      midsAdfTotal: 0,
      midsDftTotal: 0,
      ah01MidsImpacted: 0,
      ah02MidsImpacted: 0,
      ah03MidsImpacted: 0,
      ah04MidsImpacted: 0,
      ah05MidsImpacted: 0,
      ah06MidsImpacted: 0,
      ah07MidsImpacted: 0,
      ah10MidsImpacted: 0,
      ah11MidsImpacted: 0,
      ah12MidsImpacted: 0,
      ah14MidsImpacted: 0,
      ah15MidsImpacted: 0,
      ah16MidsImpacted: 0,
    };
  }
}
