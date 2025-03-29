import { DataSource } from 'typeorm';

/**
 * Interface representing parameters for the risk radar exceptions list query
 */
export interface RiskRadarExceptionsListParams {
  dtStart: Date;
  dtEnd: Date;
  pkRiskRadarExceptionStatus: number;
  pkRiskRadarUserAssigned: number;
  sMIDSearch: string;
  sGeneralSearch: string;
  sExceptionList: string;
  bViewAll: boolean;
  iSortBy: number;
  iProcessor: number;
}

/**
 * Interface representing the result of the risk radar exceptions list query
 */
export interface RiskRadarExceptionsListResult {
  pkRiskRadarExceptions: number;
  dNetDepAmt: number | null;
  sDBA: string | null;
  sSolutionConsultant: string | null;
  bSelfGen: string | null;
  iTransAmtAboveLimit: number | null;
  iNumOfKeyedTransAboveLimit: number | null;
  iBatchVolAboveLimit: number | null;
  iDupCard: number | null;
  bNewAcct: string | null;
  iDupBin: number | null;
  iLatePostTrans: number | null;
  iFgnkeyedTrans: number | null;
  iNoAuthTrans: number | null;
  iChbkOrIRR: number | null;
  bNextDayFundingAcct: string | null;
  sMID: string;
  sNTUserID: string | null;
  dtTransmission: Date | null;
  bDivert: string | null;
  sAMEXOptBlueInd: string | null;
  iAuthCaptureAmtLargeVariation: number | null;
  bRiskWatch: string | null;
  dSettlementBalance: number | null;
  iAvgBatch: number | null;
  iNegDailyBatches: number | null;
  iMototIoAVS: number | null;
  iAuthDecline: number | null;
  iTotalPoints: number | null;
  dAuthDeclineAmt: number;
  sUserReviewed: string | null;
  dtActivated: Date | null;
  dtCreated: Date;
  sChannel: string;
  iAutoHold: number | null;
  dtAutoApproved: Date | null;
  iTransAmtAboveHighTicketLimit: number | null;
  iCreditRule: number | null;
  iSalesChannelRule: number | null;
  iFundingExclusionAndException: number | null;
  dAuthNonDeclinedAmt: number;
  sReseller: string;
  sReferralPartner: string;
  sISV: string;
}

/**
 * Get risk radar exceptions list with filtering and sorting
 *
 * TypeORM implementation of the uspRiskRadarExceptionsListVer1 stored procedure.
 */
export async function getRiskRadarExceptionsList(
  financeDataSource: DataSource,
  irisDataSource: DataSource,
  connectorDataSource: DataSource,
  params: RiskRadarExceptionsListParams
): Promise<RiskRadarExceptionsListResult[]> {
  // Due to complexity of the original stored procedure with multiple temp tables
  // and cross-database joins, we'll use a raw SQL query approach with parameter binding

  // The following query simulates the original stored procedure logic
  // But adapts it to work with TypeORM and separate database connections

  // First, we need to split the exception list into an array
  const exceptionTypes = params.sExceptionList
    .split(',')
    .map(Number)
    .filter((n) => !isNaN(n));

  // Add one day to end date to match SQL Server behavior
  const endDate = new Date(params.dtEnd);
  endDate.setDate(endDate.getDate() + 1);

  // Create the query for Finance database (main query)
  const sqlQuery = `
    DECLARE @bSearch bit = 0;
    
    -- Create exception types table
    DECLARE @ExceptionTypes TABLE (pk int);
    ${exceptionTypes.map((id) => `INSERT INTO @ExceptionTypes (pk) VALUES (${id});`).join('\n')}
    
    -- Set search flag if MID or general search is provided
    IF LEN(RTRIM(LTRIM(ISNULL(@sMIDSearch, '')))) != 0 OR LEN(RTRIM(LTRIM(ISNULL(@sGeneralSearch, '')))) != 0
      SET @bSearch = 1;
    
    WITH FilteredExceptions AS (
      SELECT 
        e.pkRiskRadarExceptions,
        e.sMID,
        LEFT(e.sMID, 4) AS sMIDF4,
        e.fkRiskRadarExceptionStatus,
        e.fkRiskRadarUserAssigned,
        e.iAccountType
      FROM 
        tblRiskRadarExceptions_jeff e WITH (NOLOCK)
      WHERE 
        e.dtCreated BETWEEN @dtStart AND @dtEnd AND
        e.bHidden = 0
    ),
    ProcessorFilteredExceptions AS (
      SELECT 
        pkRiskRadarExceptions, sMID, sMIDF4, fkRiskRadarExceptionStatus, fkRiskRadarUserAssigned
      FROM 
        FilteredExceptions
      WHERE
        (@iProcessor = 0) OR
        (@iProcessor = 1 AND sMIDF4 IN ('5611', '7905')) OR
        (@iProcessor = 2 AND sMIDF4 = '8152') OR
        (@iProcessor = 3 AND iAccountType = 1)
    ),
    StatusFilteredExceptions AS (
      SELECT 
        t.pkRiskRadarExceptions, t.sMID
      FROM 
        ProcessorFilteredExceptions t
      WHERE
        (@bSearch = 1 AND (@sMIDSearch = '' OR t.sMID LIKE '%' + @sMIDSearch + '%')) OR
        (@bSearch = 0 AND @pkRiskRadarExceptionStatus = 0) OR
        (@bSearch = 0 AND @pkRiskRadarExceptionStatus != 0 AND @pkRiskRadarUserAssigned = 0 AND t.fkRiskRadarExceptionStatus = @pkRiskRadarExceptionStatus) OR
        (@bSearch = 0 AND @pkRiskRadarExceptionStatus != 0 AND @pkRiskRadarUserAssigned != 0 AND t.fkRiskRadarExceptionStatus = @pkRiskRadarExceptionStatus AND t.fkRiskRadarUserAssigned = @pkRiskRadarUserAssigned)
    ),
    ExceptionsDetails AS (
      SELECT
        e.pkRiskRadarExceptions,
        e.dNetDepAmt,
        LEFT(e.sDBA, 30) AS sDBA,
        CASE WHEN e.bSelfGen = 1 THEN 'Yes' END AS bSelfGen,
        CASE WHEN e.iTransAmtAboveLimit != 0 THEN e.iTransAmtAboveLimit END AS iTransAmtAboveLimit,
        CASE WHEN e.iNumOfKeyedTransAboveLimit != 0 THEN e.iNumOfKeyedTransAboveLimit END AS iNumOfKeyedTransAboveLimit,
        CASE WHEN ISNULL(e.iBatchVolAboveLimit, 0) != 0 THEN e.iBatchVolAboveLimit END AS iBatchVolAboveLimit,
        CASE WHEN e.iDupCard != 0 THEN e.iDupCard END AS iDupCard,
        CASE WHEN e.bNewAcct = 1 THEN 'Yes' END AS bNewAcct,
        CASE WHEN e.iDupBin != 0 THEN e.iDupBin END AS iDupBin,
        CASE WHEN e.iLatePostTrans != 0 THEN e.iLatePostTrans END AS iLatePostTrans,
        CASE WHEN e.iFgnkeyedTrans != 0 THEN e.iFgnkeyedTrans END AS iFgnkeyedTrans,
        CASE WHEN e.iNoAuthTrans != 0 THEN e.iNoAuthTrans END AS iNoAuthTrans,
        CASE WHEN e.iChbkOrIRR != 0 THEN e.iChbkOrIRR END AS iChbkOrIRR,
        CASE WHEN e.bNextDayFundingAcct = 1 THEN 'Yes' END AS bNextDayFundingAcct,
        e.sMID,
        u.sNTUserID,
        e.dtTransmission,
        CASE WHEN p.bDivert = 1 THEN 'Yes' END AS bDivert,
        CASE WHEN EXISTS (
          SELECT TOP 1 1 FROM tblRiskRadarBatch 
          WHERE sMID = e.sMID AND sAMEXOptBlueInd = 'Y' 
          ORDER BY pkDFT256Batch DESC
        ) THEN 'Yes' END AS sAMEXOptBlueInd,
        CASE WHEN e.iAuthCaptureAmtLargeVariation != 0 THEN e.iAuthCaptureAmtLargeVariation END AS iAuthCaptureAmtLargeVariation,
        CASE WHEN p.bRiskWatch = 1 THEN 'Yes' END AS bRiskWatch,
        CASE WHEN e.iAvgBatch != 0 THEN e.iAvgBatch END AS iAvgBatch,
        CASE WHEN e.iNegDailyBatches != 0 THEN e.iNegDailyBatches END AS iNegDailyBatches,
        CASE WHEN e.iMototIoAVS != 0 THEN e.iMototIoAVS END AS iMototIoAVS,
        CASE WHEN e.iAuthDecline != 0 THEN e.iAuthDecline END AS iAuthDecline,
        e.dAuthDeclineAmt,
        e.sUserReviewed,
        e.dtCreated,
        CASE WHEN e.iAutoHold != 0 THEN e.iAutoHold END AS iAutoHold,
        CASE WHEN e.iTransAmtAboveHighTicketLimit != 0 THEN e.iTransAmtAboveHighTicketLimit END AS iTransAmtAboveHighTicketLimit,
        CASE WHEN e.iCreditRule != 0 THEN e.iCreditRule END AS iCreditRule,
        CASE WHEN e.iSalesChannelRule != 0 THEN e.iSalesChannelRule END AS iSalesChannelRule,
        e.iFundingExclusionAndException,
        e.dAuthNonDeclinedAmt,
        '' AS sChannel,
        '' AS sReseller,
        '' AS sReferralPartner,
        '' AS sSolutionConsultant,
        '' AS sISV,
        ISNULL(e.iTransAmtAboveLimit, 0) +
        ISNULL(e.iNumOfKeyedTransAboveLimit, 0) +
        ISNULL(e.iBatchVolAboveLimit, 0) +
        ISNULL(e.iDupCard, 0) +
        ISNULL(e.iDupBin, 0) +
        ISNULL(e.iLatePostTrans, 0) +
        ISNULL(e.iFgnkeyedTrans, 0) +
        ISNULL(e.iNoAuthTrans, 0) +
        ISNULL(e.iChbkOrIRR, 0) +
        ISNULL(e.iAuthCaptureAmtLargeVariation, 0) +
        ISNULL(e.iAvgBatch, 0) +
        ISNULL(e.iNegDailyBatches, 0) +
        ISNULL(e.iMototIoAVS, 0) +
        ISNULL(e.iAuthDecline, 0) +
        ISNULL(e.iTransAmtAboveHighTicketLimit, 0) +
        ISNULL(e.iCreditRule, 0) +
        ISNULL(e.iSalesChannelRule, 0) +
        ISNULL(e.iAutoHold, 0) AS iTotalPoints
      FROM 
        StatusFilteredExceptions tmp
        JOIN tblRiskRadarExceptions_Jeff e WITH (NOLOCK) ON e.pkRiskRadarExceptions = tmp.pkRiskRadarExceptions
        LEFT JOIN tblRiskRadarUser u WITH (NOLOCK) ON u.pkRiskRadarUser = e.fkRiskRadarUserAssigned
        LEFT JOIN tblRiskRadarMerchAdjParam p ON p.sMID = e.sMID
    ),
    ExceptionFiltering AS (
      SELECT ed.* 
      FROM ExceptionsDetails ed
      WHERE
        (@bViewAll = 1) OR
        (@bViewAll = 0 AND (ISNULL(ed.iNegDailyBatches, 0) != 0 OR iTotalPoints > 20)) OR
        (ed.sMID = @sMIDSearch AND @sMIDSearch != '')
    )
    SELECT 
      ef.pkRiskRadarExceptions,
      ef.dNetDepAmt,
      ef.sDBA,
      ef.sSolutionConsultant,
      ef.bSelfGen,
      ef.iTransAmtAboveLimit,
      ef.iNumOfKeyedTransAboveLimit,
      ef.iBatchVolAboveLimit,
      ef.iDupCard,
      ef.bNewAcct,
      ef.iDupBin,
      ef.iLatePostTrans,
      ef.iFgnkeyedTrans,
      ef.iNoAuthTrans,
      ef.iChbkOrIRR,
      ef.bNextDayFundingAcct,
      ef.sMID,
      ef.sNTUserID,
      ef.dtTransmission,
      ef.bDivert,
      ef.sAMEXOptBlueInd,
      ef.iAuthCaptureAmtLargeVariation,
      ef.bRiskWatch,
      sb.dSettlementBalance,
      ef.iAvgBatch,
      ef.iNegDailyBatches,
      ef.iMototIoAVS,
      ef.iAuthDecline,
      CASE WHEN ISNULL(ef.iTotalPoints, 0) > 0 THEN ef.iTotalPoints END AS iTotalPoints,
      ISNULL(ef.dAuthDeclineAmt, 0) AS dAuthDeclineAmt,
      ef.sUserReviewed,
      a.dtActivated,
      ef.dtCreated,
      ef.sChannel,
      ef.iAutoHold,
      aa.dtIrisUpdated AS dtAutoApproved,
      ef.iTransAmtAboveHighTicketLimit,
      ef.iCreditRule,
      ef.iSalesChannelRule,
      ef.iFundingExclusionAndException,
      ISNULL(ef.dAuthNonDeclinedAmt, 0) AS dAuthNonDeclinedAmt,
      ef.sReseller,
      ef.sReferralPartner,
      ef.sISV
    FROM 
      ExceptionFiltering ef
      LEFT JOIN @CONNECTOR_SETTLEMENT_BALANCE_TABLE sb ON sb.sMID = ef.sMID
      LEFT JOIN @CONNECTOR_ACTIVATED_TABLE a ON a.sMID = ef.sMID
      LEFT JOIN @IRIS_AUTO_APPROVAL_TABLE aa ON aa.IrisMId = ef.sMID
    ORDER BY
      CASE 
        WHEN @iSortBy = -1 THEN ISNULL(ef.dNetDepAmt, 0) END,
        WHEN @iSortBy = -2 THEN ef.sDBA END,
        WHEN @iSortBy = -3 THEN ef.sSolutionConsultant END,
        WHEN @iSortBy = -4 THEN ef.bSelfGen END,
        WHEN @iSortBy = -5 THEN ef.iTransAmtAboveLimit END,
        WHEN @iSortBy = -6 THEN ef.iNumOfKeyedTransAboveLimit END,
        WHEN @iSortBy = -7 THEN ef.iBatchVolAboveLimit END,
        WHEN @iSortBy = -8 THEN ef.iDupCard END,
        WHEN @iSortBy = -9 THEN ef.bNewAcct END,
        WHEN @iSortBy = -10 THEN ef.iDupBin END,
        WHEN @iSortBy = -11 THEN ef.iLatePostTrans END,
        WHEN @iSortBy = -12 THEN ef.iFgnkeyedTrans END,
        WHEN @iSortBy = -13 THEN ef.iNoAuthTrans END,
        WHEN @iSortBy = -14 THEN ef.iChbkOrIRR END,
        WHEN @iSortBy = -15 THEN ef.bNextDayFundingAcct END,
        WHEN @iSortBy = -16 THEN ef.sMID END,
        WHEN @iSortBy = -17 THEN ef.sNTUserID END,
        WHEN @iSortBy = -18 THEN ef.dtTransmission END,
        WHEN @iSortBy = -19 THEN ef.bDivert END,
        WHEN @iSortBy = -20 THEN ef.sAMEXOptBlueInd END,
        WHEN @iSortBy = -21 THEN ef.iAuthCaptureAmtLargeVariation END,
        WHEN @iSortBy = -22 THEN ef.iMototIoAVS END,
        WHEN @iSortBy = -23 THEN ISNULL(sb.dSettlementBalance, 0) END,
        WHEN @iSortBy = -24 THEN ef.bRiskWatch END,
        WHEN @iSortBy = -25 THEN ef.iAvgBatch END,
        WHEN @iSortBy = -26 THEN ef.iAuthDecline END,
        WHEN @iSortBy = -27 THEN ef.iNegDailyBatches END,
        WHEN @iSortBy = -28 THEN ef.iTotalPoints END,
        WHEN @iSortBy = -29 THEN ISNULL(ef.dAuthDeclineAmt, 0) END,
        WHEN @iSortBy = -30 THEN ef.sUserReviewed END,
        WHEN @iSortBy = -31 THEN a.dtActivated END,
        WHEN @iSortBy = -32 THEN ef.dtCreated END,
        WHEN @iSortBy = -33 THEN ef.sChannel END,
        WHEN @iSortBy = -34 THEN ef.iAutoHold END,
        WHEN @iSortBy = -35 THEN aa.dtIrisUpdated END,
        WHEN @iSortBy = -36 THEN ef.iTransAmtAboveHighTicketLimit END,
        WHEN @iSortBy = -37 THEN ef.iCreditRule END,
        WHEN @iSortBy = -38 THEN ef.iSalesChannelRule END,
        WHEN @iSortBy = -39 THEN ef.iFundingExclusionAndException END,
        WHEN @iSortBy = -40 THEN ISNULL(ef.dAuthNonDeclinedAmt, 0) END DESC,
        WHEN @iSortBy = -41 THEN ef.sReseller END,
        WHEN @iSortBy = -42 THEN ef.sReferralPartner END,
        WHEN @iSortBy = -43 THEN ef.sISV END,
        WHEN @iSortBy = 1 THEN ISNULL(ef.dNetDepAmt, 0) END DESC,
        WHEN @iSortBy = 2 THEN ef.sDBA END DESC,
        WHEN @iSortBy = 3 THEN ef.sSolutionConsultant END DESC,
        WHEN @iSortBy = 4 THEN ef.bSelfGen END DESC,
        WHEN @iSortBy = 5 THEN ef.iTransAmtAboveLimit END DESC,
        WHEN @iSortBy = 6 THEN ef.iNumOfKeyedTransAboveLimit END DESC,
        WHEN @iSortBy = 7 THEN ef.iBatchVolAboveLimit END DESC,
        WHEN @iSortBy = 8 THEN ef.iDupCard END DESC,
        WHEN @iSortBy = 9 THEN ef.bNewAcct END DESC,
        WHEN @iSortBy = 10 THEN ef.iDupBin END DESC,
        WHEN @iSortBy = 11 THEN ef.iLatePostTrans END DESC,
        WHEN @iSortBy = 12 THEN ef.iFgnkeyedTrans END DESC,
        WHEN @iSortBy = 13 THEN ef.iNoAuthTrans END DESC,
        WHEN @iSortBy = 14 THEN ef.iChbkOrIRR END DESC,
        WHEN @iSortBy = 15 THEN ef.bNextDayFundingAcct END DESC,
        WHEN @iSortBy = 16 THEN ef.sMID END DESC,
        WHEN @iSortBy = 17 THEN ef.sNTUserID END DESC,
        WHEN @iSortBy = 18 THEN ef.dtTransmission END DESC,
        WHEN @iSortBy = 19 THEN ef.bDivert END DESC,
        WHEN @iSortBy = 20 THEN ef.sAMEXOptBlueInd END DESC,
        WHEN @iSortBy = 21 THEN ef.iAuthCaptureAmtLargeVariation END DESC,
        WHEN @iSortBy = 22 THEN ef.iMototIoAVS END DESC,
        WHEN @iSortBy = 23 THEN ISNULL(sb.dSettlementBalance, 0) END DESC,
        WHEN @iSortBy = 24 THEN ef.bRiskWatch END DESC,
        WHEN @iSortBy = 25 THEN ef.iAvgBatch END DESC,
        WHEN @iSortBy = 26 THEN ef.iAuthDecline END DESC,
        WHEN @iSortBy = 27 THEN ef.iNegDailyBatches END DESC,
        WHEN @iSortBy = 28 THEN ef.iTotalPoints END DESC,
        WHEN @iSortBy = 29 THEN ISNULL(ef.dAuthDeclineAmt, 0) END DESC,
        WHEN @iSortBy = 30 THEN ef.sUserReviewed END DESC,
        WHEN @iSortBy = 31 THEN a.dtActivated END DESC,
        WHEN @iSortBy = 32 THEN ef.dtCreated END DESC,
        WHEN @iSortBy = 33 THEN ef.sChannel END DESC,
        WHEN @iSortBy = 34 THEN ef.iAutoHold END DESC,
        WHEN @iSortBy = 35 THEN aa.dtIrisUpdated END DESC,
        WHEN @iSortBy = 36 THEN ef.iTransAmtAboveHighTicketLimit END DESC,
        WHEN @iSortBy = 37 THEN ef.iCreditRule END DESC,
        WHEN @iSortBy = 38 THEN ef.iSalesChannelRule END DESC,
        WHEN @iSortBy = 39 THEN ef.iFundingExclusionAndException END DESC,
        WHEN @iSortBy = 40 THEN ISNULL(ef.dAuthNonDeclinedAmt, 0) END DESC,
        WHEN @iSortBy = 41 THEN ef.sReseller END DESC,
        WHEN @iSortBy = 42 THEN ef.sReferralPartner END DESC,
        WHEN @iSortBy = 43 THEN ef.sISV END DESC
  `;

  // Data for replacement placeholders in the main query
  // First, get the connector database data
  const connectorActivatedData = await connectorDataSource.query(`
    SELECT DISTINCT sMID, dtActivated 
    FROM tblSnapShotvwLeadsStatusActive 
    WHERE iOrder = 1
  `);

  const connectorSettlementData = await connectorDataSource.query(`
    SELECT sMID, dSettlementBalance 
    FROM tblSnapShotvwNetSettlementBalanceActive 
    WHERE iOrder = 1
  `);

  // Get iris auto approval data
  const irisAutoApprovalData = await irisDataSource.query(`
    SELECT l.IrisMId, aa.dtIrisUpdated 
    FROM tblAutoApproval aa
    JOIN leads l ON l.id = aa.LeadId AND l.IsArchived = 0
    JOIN LeadsBusinessInformation lbi ON lbi.LeadId = l.Id
    WHERE aa.dtIrisUpdated IS NOT NULL
  `);

  // Convert to JSON strings for insertion into query
  const activatedTableJson = JSON.stringify(connectorActivatedData);
  const settlementBalanceTableJson = JSON.stringify(connectorSettlementData);
  const autoApprovalTableJson = JSON.stringify(irisAutoApprovalData);

  // Replace placeholders with JSON table declarations
  const modifiedQuery = sqlQuery
    .replace(
      '@CONNECTOR_ACTIVATED_TABLE',
      `(SELECT * FROM OPENJSON('${activatedTableJson}') WITH (sMID varchar(16), dtActivated datetime))`
    )
    .replace(
      '@CONNECTOR_SETTLEMENT_BALANCE_TABLE',
      `(SELECT * FROM OPENJSON('${settlementBalanceTableJson}') WITH (sMID varchar(16), dSettlementBalance decimal(18,2)))`
    )
    .replace(
      '@IRIS_AUTO_APPROVAL_TABLE',
      `(SELECT * FROM OPENJSON('${autoApprovalTableJson}') WITH (IrisMId varchar(20), dtIrisUpdated datetime))`
    );

  // Execute the query with parameters
  const result = await financeDataSource.query(modifiedQuery, [
    { name: 'dtStart', value: params.dtStart },
    { name: 'dtEnd', value: endDate },
    {
      name: 'pkRiskRadarExceptionStatus',
      value: params.pkRiskRadarExceptionStatus,
    },
    { name: 'pkRiskRadarUserAssigned', value: params.pkRiskRadarUserAssigned },
    { name: 'sMIDSearch', value: params.sMIDSearch || '' },
    { name: 'sGeneralSearch', value: params.sGeneralSearch || '' },
    { name: 'bViewAll', value: params.bViewAll ? 1 : 0 },
    { name: 'iSortBy', value: params.iSortBy },
    { name: 'iProcessor', value: params.iProcessor },
  ]);

  return result;
}

/**
 * Alternative implementation using a direct stored procedure call
 * This is simpler but requires that the original stored procedure exists in the database
 */
export async function callRiskRadarExceptionsListStoredProcedure(
  financeDataSource: DataSource,
  params: RiskRadarExceptionsListParams
): Promise<RiskRadarExceptionsListResult[]> {
  const result = await financeDataSource.query(
    `
    EXEC [dbo].[uspRiskRadarExceptionsListVer1]
      @dtStart = @0,
      @dtEnd = @1,
      @pkRiskRadarExceptionStatus = @2,
      @pkRiskRadarUserAssigned = @3,
      @sMIDSearch = @4,
      @sGeneralSearch = @5,
      @sExceptionList = @6,
      @bViewAll = @7,
      @iSortBy = @8,
      @iProcessor = @9
  `,
    [
      params.dtStart,
      params.dtEnd,
      params.pkRiskRadarExceptionStatus,
      params.pkRiskRadarUserAssigned,
      params.sMIDSearch || '',
      params.sGeneralSearch || '',
      params.sExceptionList || '',
      params.bViewAll ? 1 : 0,
      params.iSortBy,
      params.iProcessor,
    ]
  );

  return result;
}
