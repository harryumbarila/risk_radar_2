import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';

import type { RiskRadarExceptionsListRow } from '@/shared/response/risk-radar/exception-list/exception-list-row';

import { DEFAULT_BLANK_VALUE } from './default-values';
import {
  formatBoolean,
  formatCurrency,
  formatDate,
  formatNumber,
  formatScore,
} from './formatters';

// any needs to be used here to avoid a typing issue from tanstack/table
// https://github.com/TanStack/table/issues/4382#issuecomment-1420412062
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RiskRadarTableColumn = ColumnDef<RiskRadarExceptionsListRow, any>;

export const columnHelper = createColumnHelper<RiskRadarExceptionsListRow>();

export const baseColumns = [
  columnHelper.accessor(
    (row) => row.sDBA || row.leadName || DEFAULT_BLANK_VALUE,
    {
      id: 'sDBA',
      header: 'DBA',
    }
  ),
  columnHelper.accessor('dNetDepAmt', {
    header: 'Net Deposit',
    cell: ({ getValue }) => formatCurrency(getValue()),
  }),
  columnHelper.accessor('dAuthNonDeclinedAmt', {
    header: 'FSP Approved Auth',
    cell: ({ getValue }) => formatCurrency(getValue()),
  }),
  columnHelper.accessor('dAuthDeclineAmt', {
    header: 'Auth Decline',
    cell: ({ getValue }) => formatCurrency(getValue()),
  }),
  columnHelper.accessor('dtActivated', {
    header: 'Activation Date',
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  columnHelper.accessor('sChannel', { header: 'Channel' }),
  columnHelper.accessor('sReseller', { header: 'Reseller' }),
  columnHelper.accessor('sReferralPartner', { header: 'Referral Partner' }),
  columnHelper.accessor('sSolutionConsultant', {
    header: 'Solution Consultant',
  }),
  columnHelper.accessor('dtAutoApproved', {
    header: 'Auto Approved',
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  columnHelper.accessor('bRiskWatch', {
    header: 'Risk Watch',
    cell: ({ getValue }) => formatBoolean(getValue()),
  }),
  columnHelper.accessor('bNewAcct', {
    header: 'New Account',
    cell: ({ getValue }) => formatBoolean(getValue()),
  }),
  columnHelper.accessor('iNumOfKeyedTransAboveLimit', {
    header: 'Keyed %',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iTransAmtAboveLimit', {
    header: 'Avg Ticket',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iTransAmtAboveHighTicketLimit', {
    header: 'High Ticket',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iCreditRule', {
    header: 'Credit',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iSalesChannelRule', {
    header: 'Channel',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iBatchVolAboveLimit', {
    header: 'Monthly Vol',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iAvgBatch', {
    header: 'Avg Batch',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iDupCard', {
    header: 'Dup Card',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iDupBin', {
    header: 'Dup Bin',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iLatePostTrans', {
    header: 'Late Post',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iFgnkeyedTrans', {
    header: 'Foreign Keyed',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('iChbkOrIRR', {
    header: 'Chargeback',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('bNextDayFundingAcct', {
    header: 'Next Day Funding',
    cell: ({ getValue }) => formatBoolean(getValue()),
  }),
  columnHelper.accessor('bDivert', {
    header: 'Divert',
    cell: ({ getValue }) => formatBoolean(getValue()),
  }),
  columnHelper.accessor('dSettlementBalance', {
    header: 'NET Divert Balance',
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  columnHelper.accessor('sAMEXOptBlueInd', {
    header: 'Amex OptBlue',
    cell: ({ getValue }) => formatBoolean(getValue()),
  }),
  columnHelper.accessor('iMototIoAVS', {
    header: 'MOTO AVS',
    cell: ({ getValue }) => formatScore(getValue()),
  }),
  columnHelper.accessor('iAuthCaptureAmtLargeVariation', {
    header: 'Settle 30%+',
    cell: ({ getValue }) => formatScore(getValue()),
  }),
  columnHelper.accessor('iNoAuthTrans', {
    header: 'No Auth',
    cell: ({ getValue }) => formatScore(getValue()),
  }),
  columnHelper.accessor('iAuthDecline', {
    header: 'Auth Decline',
    cell: ({ getValue }) => formatScore(getValue()),
  }),
  columnHelper.accessor('iNegDailyBatches', {
    header: 'Negative Batch',
    cell: ({ getValue }) => formatScore(getValue()),
  }),
  columnHelper.accessor('iAutoHold', {
    header: 'Auto Hold',
    cell: ({ getValue }) => formatScore(getValue()),
  }),
  columnHelper.accessor('iFundingExclusionAndException', {
    header: 'Funding Exception',
    cell: ({ getValue }) => formatScore(getValue()),
  }),
  columnHelper.accessor('iTotalPoints', {
    header: 'Total Points',
    cell: ({ getValue }) => formatScore(getValue()),
  }),
  columnHelper.accessor('dtCreated', {
    header: 'Exception Created',
    cell: ({ getValue }) => formatDate(getValue()),
  }),
];
