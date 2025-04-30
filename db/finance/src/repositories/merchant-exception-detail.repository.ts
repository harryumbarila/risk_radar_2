import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { DataSource, Repository } from 'typeorm';
import { MssqlParameter } from 'typeorm';

import {
  ChargeBacksEntity,
  RiskRadarExceptionListLookupEntity,
} from '../entities';

// Define interfaces for the return types
export type MonthlyProcessingSummary = {
  year: number;
  month: string;
  volume: number;
  averageTicket: number;
  swipedPercentageBasedOnTransCount: number;
  highestTicket: number;
  totalChargebacks: number;
  visaChargebackPercentage: number;
  mastercardChargebackPercentage: number;
  discoverChargebackPercentage: number;
  amexChargebackPercentage: number;
};

export type MerchantInfo = {
  dbaName: string;
  dbaAddress: string;
  dbaCity: string;
  dbaState: string;
  dbaZip: string;
  contactPhoneNumber: string;
  dbaLocationFax: string;
  contactEmailAddress: string;
  website: string;
  legalName: string;
  legalAddress: string;
  legalCity: string;
  legalState: string;
  legalZip: string;
  ownershipType: string;
  mccCode: string;
  mccDescription: string;
  sourceName: string;
  businessType: string;
  activatedDate: Date | null;
  monthlyVolume: number;
  averageTicket: number;
  swipePercent: number;
  isDivert: boolean;
  preferredContact: string;
  exceptionStatusId: number | null;
  merchantCashAdvance: string;
  isRiskWatch: boolean;
  netSettlementBalance: number;
  swipedPercentageBasedOnTransCount: number;
  channel: string;
  isa: string;
  averageMonthlySalesVolume: number;
  averageTicketSizeAmount: number;
  storeFrontSwiped: number;
  isAutoHoldWhiteLabel: boolean;
  highestTicketSizeAmount: number;
  reseller: string;
  referralPartner: string;
  talusPayApp: string;
  isv: string;
};

@Injectable()
export class MerchantExceptionDetailRepository {
  private chargeBacksRepository: Repository<ChargeBacksEntity>;

  private exceptionListRepository: Repository<RiskRadarExceptionListLookupEntity>;

  public constructor(
    @InjectDataSource('finance') private readonly dataSource: DataSource
  ) {
    this.chargeBacksRepository =
      this.dataSource.getRepository(ChargeBacksEntity);
    this.exceptionListRepository = this.dataSource.getRepository(
      RiskRadarExceptionListLookupEntity
    );
  }

  /**
   * Gets the number of chargebacks and IRRs for a merchant in the last 30 days
   */
  public async getChargebacksCount(
    mid: string
  ): Promise<{ chg: number; irr: number }> {
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all chargebacks for this merchant in the last 30 days using explicit varchar casting
    const chargebacks = await this.chargeBacksRepository
      .createQueryBuilder('chargebacks')
      .where('chargebacks.mid = :mid', {
        mid: new MssqlParameter(mid, 'varchar', 16),
      })
      .andWhere('chargebacks.createdDate > :thirtyDaysAgo', { thirtyDaysAgo })
      .getMany();

    // Count CHG and IRR types
    const chg = chargebacks.filter((cb) => cb.type === 'CHG').length;
    const irr = chargebacks.filter((cb) => cb.type === 'IRR').length;

    return { chg, irr };
  }

  /**
   * Gets data about monthly processing for a merchant
   *
   * This is a hybrid approach as we still need SQL for temp tables and complex calculations
   */
  public async getMonthlyProcessingSummary(
    mid: string
  ): Promise<MonthlyProcessingSummary[]> {
    // We need to use raw SQL for this operation due to the temp table requirements
    // TypeORM doesn't support temp tables directly
    const query = `
      -- Create a temp table with the last 12 months
      DECLARE @temp TABLE(iYear INT, iMonth INT);
      DECLARE @i INT = 0;
      DECLARE @dt DATETIME = CAST(MONTH(GETDATE()) AS VARCHAR) + '/1/' + CAST(YEAR(GETDATE()) AS VARCHAR);
      
      WHILE @i <= 11
      BEGIN
        INSERT INTO @temp(iYear, iMonth)
        SELECT 
          YEAR(DATEADD(MONTH, -1 * @i, @dt)),
          MONTH(DATEADD(MONTH, -1 * @i, @dt));
        
        SET @i = @i + 1;
      END
      
      -- Select and format the results
      SELECT
        t.iYear as year,
        CASE 
          WHEN t.iMonth = 1 THEN 'Jan'
          WHEN t.iMonth = 2 THEN 'Feb'
          WHEN t.iMonth = 3 THEN 'Mar'
          WHEN t.iMonth = 4 THEN 'Apr'
          WHEN t.iMonth = 5 THEN 'May'
          WHEN t.iMonth = 6 THEN 'Jun'
          WHEN t.iMonth = 7 THEN 'Jul'
          WHEN t.iMonth = 8 THEN 'Aug'
          WHEN t.iMonth = 9 THEN 'Sep'
          WHEN t.iMonth = 10 THEN 'Oct'
          WHEN t.iMonth = 11 THEN 'Nov'
          WHEN t.iMonth = 12 THEN 'Dec'
          ELSE ''
        END AS month,
        ISNULL(s.dVol, 0) AS volume,
        ISNULL(s.dAvgTkt, 0) AS averageTicket,
        ISNULL(s.iSwipedPercBasedOnTransCnt, 0) AS swipedPercentageBasedOnTransCount,
        ISNULL(s.dHighestTkt, 0) AS highestTicket,
        ISNULL(cb.dTotCB, 0) AS totalChargebacks,
        ISNULL(cb.dVCBPerc, 0) AS visaChargebackPercentage,
        ISNULL(cb.dMCCBPerc, 0) AS mastercardChargebackPercentage,
        ISNULL(cb.dDCBPerc, 0) AS discoverChargebackPercentage,
        ISNULL(cb.dACBPerc, 0) AS amexChargebackPercentage
      FROM @temp t
      LEFT JOIN Finance.dbo.tblDDTMonthlyProcessingSummary s 
        ON s.iYear = t.iYear AND s.iMonth = t.iMonth AND s.sMID = CAST(@0 AS varchar(16))
      LEFT JOIN (
        -- Chargebacks summary subquery 
        SELECT 
          cb.iYear,
          cb.iMonth,
          SUM(cb.dAmt) AS dTotCB,
          CAST(SUM(CASE WHEN LEFT(cb.sCardNum, 1) = '4' THEN cb.dAmt ELSE 0 END) / 
               NULLIF(SUM(cb.dAmt), 0) * 100 AS DECIMAL(18,2)) AS dVCBPerc,
          CAST(SUM(CASE WHEN LEFT(cb.sCardNum, 1) = '5' THEN cb.dAmt ELSE 0 END) / 
               NULLIF(SUM(cb.dAmt), 0) * 100 AS DECIMAL(18,2)) AS dMCCBPerc,
          CAST(SUM(CASE WHEN LEFT(cb.sCardNum, 1) = '6' THEN cb.dAmt ELSE 0 END) / 
               NULLIF(SUM(cb.dAmt), 0) * 100 AS DECIMAL(18,2)) AS dDCBPerc,
          CAST(SUM(CASE WHEN LEFT(cb.sCardNum, 1) = '3' THEN cb.dAmt ELSE 0 END) / 
               NULLIF(SUM(cb.dAmt), 0) * 100 AS DECIMAL(18,2)) AS dACBPerc
        FROM (
          SELECT 
            YEAR(dtReceived) AS iYear, 
            MONTH(dtReceived) AS iMonth,
            sCardNum,
            dAmt
          FROM Finance.dbo.tblChargeBacks
          WHERE sMID = CAST(@0 AS varchar(16))
        ) cb
        GROUP BY cb.iYear, cb.iMonth
      ) cb ON cb.iYear = t.iYear AND cb.iMonth = t.iMonth
      ORDER BY t.iYear DESC, t.iMonth DESC
    `;

    return this.dataSource.query(query, [mid]);
  }

  /**
   * Gets a list of exception types
   */
  public async getExceptionTypes(): Promise<
    RiskRadarExceptionListLookupEntity[]
  > {
    return this.exceptionListRepository.find({
      where: {
        isHidden: false,
      },
      order: {
        id: 'ASC',
      },
    });
  }

  /**
   * Gets merchant general information - this still uses raw SQL for the complex cross-database joins
   * We provide a strongly typed interface for the return value
   */
  public async getMerchantInfo(
    mid: string,
    exceptionId?: number
  ): Promise<MerchantInfo | null> {
    // Due to the complexity of this query with cross-database joins and subqueries,
    // we'll still use raw SQL but with improved parameter handling and typing
    const query = `
      SELECT TOP 1
        lbi.DBAName as dbaName,
        lbi.DBAAddress as dbaAddress,
        lbi.DBACity as dbaCity,
        lbi.DBAState as dbaState,
        lbi.DBAZip as dbaZip,
        lbi.ContactPhoneNumber as contactPhoneNumber,
        lbi.DBALocationFax as dbaLocationFax,
        lbi.ContactEmailAddress as contactEmailAddress,
        lbi.Website as website,
        lbi.LegalName as legalName,
        lbi.LegalAddress as legalAddress,
        lbi.LegalCity as legalCity,
        lbi.LegalState as legalState,
        lbi.LegalZIP as legalZip,
        lbi.OwnershipType as ownershipType,
        lbi.MccCode as mccCode,
        lbi.MccDescription as mccDescription,
        s.SourceName as sourceName,
        lbi.BusinessType as businessType,
        vls.ActivatedDate as activatedDate,
        p.iMonVol_CalcMonthly AS monthlyVolume,
        p.iAvgTkt_CalcMonthly AS averageTicket,
        p.iSwipePercent_CalcMonthly AS swipePercent,
        p.bDivert as isDivert,
        p.sPreferredContact as preferredContact,
        e.fkRiskRadarExceptionStatus as exceptionStatusId,
        ls.MerchantCashAdvance as merchantCashAdvance,
        p.bRiskWatch as isRiskWatch,
        (SELECT dBalanceAmt + dPendingAmt FROM CrescentView.dbo.vwNetSettlementBalance WHERE sMID = @0) AS netSettlementBalance,
        x.iSwipedPercBasedOnTransCntCurrMonth as swipedPercentageBasedOnTransCount,
        psa.sChannel as channel,
        psa.sSolutionConsultant AS isa,
        uw.AverageMonthlySalesVolume as averageMonthlySalesVolume,
        uw.AverageTicketSizeAmount as averageTicketSizeAmount,
        fp.StoreFrontSwiped as storeFrontSwiped,
        p.bAutoHoldWhiteLabel as isAutoHoldWhiteLabel,
        uw.HighestTicketSizeAmount as highestTicketSizeAmount,
        psa.sReseller as reseller,
        psa.sReferralPartner as referralPartner,
        ls.TalusPayApp as talusPayApp,
        psa.sISV as isv
      FROM Iris.dbo.Leads l
      JOIN Iris.dbo.LeadsBusinessInformation lbi ON lbi.LeadId = l.id
      JOIN Iris.dbo.LeadsServices ls ON ls.LeadId = l.Id
      JOIN Finance.dbo.tblRiskRadarMerchAdjParam p ON p.sMID = l.IrisMId
      LEFT JOIN Iris.dbo.LeadsUnderwriting uw ON uw.LeadId = l.id
      LEFT JOIN Iris.dbo.LeadsFinancialProfile fp ON fp.LeadId = l.id
      LEFT JOIN Iris.dbo.vwLeadsStatus vls ON vls.MID = l.IrisMId
      LEFT JOIN Finance.dbo.tblRiskRadarExceptions_Jeff e ON e.pkRiskRadarExceptions = @1
      LEFT JOIN Iris.dbo.[Group] g ON g.Id = l.GroupId
      LEFT JOIN Iris.dbo.[Source] s ON s.id = l.SourceId
      LEFT JOIN (
        SELECT @0 AS sMID, 
               MAX(ISNULL(iSwipedPercBasedOnTransCnt, 0)) AS iSwipedPercBasedOnTransCntCurrMonth, 
               MAX(ISNULL(dHighestTkt, 0)) AS dHighestTkt
        FROM Finance.dbo.tblDDTMonthlyProcessingSummary 
        WHERE iYear = YEAR(GETDATE()) AND iMonth = MONTH(GETDATE()) AND sMID = @0
      ) AS x ON x.sMID = l.IrisMId 
      LEFT JOIN (
        SELECT 
          sMID, 
          sChannel, 
          sReseller, 
          sReferralPartner, 
          sSolutionConsultant, 
          sISV 
        FROM Iris.dbo.tblPartnerAndSalesAgentIdentification 
        WHERE sMID = @0
      ) psa ON psa.sMID = l.IrisMId
      WHERE l.IrisMId = @0 AND l.IsArchived = 0 AND LEN(l.IrisMId) > 11
    `;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const results = await this.dataSource.query(query, [mid, exceptionId]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    return results[0] || null;
  }
}
