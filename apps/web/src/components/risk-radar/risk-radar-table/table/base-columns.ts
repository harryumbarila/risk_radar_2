import type { Column } from 'react-table';

import type { RiskRadarExceptionsListRow } from '@/shared/response/risk-radar/exception-list/exception-list-row';

import { DEFAULT_BLANK_VALUE } from './default-values';
import {
  formatBoolean,
  formatDate,
  formatNumber,
  formatScore,
} from './formatters';

type CustomColumn = Column<RiskRadarExceptionsListRow>;

export const baseColumns: CustomColumn[] = [
  {
    Header: 'DBA',
    accessor: (row) => row.sDBA || row.leadName || DEFAULT_BLANK_VALUE,
  },
  {
    Header: 'Net Deposit',
    accessor: 'dNetDepAmt',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'FSP Approved Auth',
    accessor: () => 0, // This field doesn't exist in the API response
    Cell: ({ value }: { value: unknown }) => formatNumber(value),
  },
  {
    Header: 'Auth Decline',
    accessor: 'dAuthDeclineAmt',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Activation Date',
    accessor: 'dtActivated',
    Cell: ({ value }) => formatDate(value),
  },
  {
    Header: 'Channel',
    accessor: 'sChannel',
  },
  {
    Header: 'Reseller',
    accessor: 'sReseller',
  },
  {
    Header: 'Referral Partner',
    accessor: 'sReferralPartner',
  },
  {
    Header: 'Solution Consultant',
    accessor: 'sSolutionConsultant',
  },
  {
    Header: 'Risk Watch',
    accessor: 'bRiskWatch',
    Cell: ({ value }) => formatBoolean(value),
  },
  {
    Header: 'New Account',
    accessor: 'bNewAcct',
    Cell: ({ value }) => formatBoolean(value),
  },
  {
    Header: 'Keyed %',
    accessor: 'iNumOfKeyedTransAboveLimit',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Avg Ticket',
    accessor: () => 0, // Not in the API response
    Cell: ({ value }: { value: unknown }) => formatNumber(value),
  },
  {
    Header: 'High Ticket',
    accessor: 'iTransAmtAboveHighTicketLimit',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Credit',
    accessor: 'iCreditRule',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Channel',
    accessor: 'iSalesChannelRule',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Monthly Vol',
    accessor: 'iBatchVolAboveLimit',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Avg Batch',
    accessor: 'iAvgBatch',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Dup Card',
    accessor: 'iDupCard',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Dup Bin',
    accessor: 'iDupBin',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Late Post',
    accessor: 'iLatePostTrans',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Foreign Keyed',
    accessor: 'iFgnkeyedTrans',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Chargeback',
    accessor: 'iChbkOrIRR',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Divert',
    accessor: 'bDivert',
    Cell: ({ value }) => formatBoolean(value),
  },
  {
    Header: 'Divert Balance',
    accessor: 'dSettlementBalance',
    Cell: ({ value }) => formatNumber(value),
  },
  {
    Header: 'Amex OptBlue',
    accessor: 'sAMEXOptBlueInd',
    Cell: ({ value }) => formatBoolean(value),
  },
  {
    Header: 'MOTO AVS',
    accessor: 'iMototIoAVS',
    Cell: ({ value }) => formatScore(value),
  },
  {
    Header: 'Settle 30%+',
    accessor: 'iAuthCaptureAmtLargeVariation',
    Cell: ({ value }) => formatScore(value),
  },
  {
    Header: 'No Auth',
    accessor: 'iNoAuthTrans',
    Cell: ({ value }) => formatScore(value),
  },
  {
    Header: 'Auth Decline',
    accessor: 'iAuthDecline',
    Cell: ({ value }) => formatScore(value),
  },
  {
    Header: 'Negative Batch',
    accessor: 'iNegDailyBatches',
    Cell: ({ value }) => formatScore(value),
  },
  {
    Header: 'Auto Hold',
    accessor: 'iAutoHold',
    Cell: ({ value }) => formatScore(value),
  },
  {
    Header: 'Funding Exception',
    accessor: 'iFundingExclusionAndException',
    Cell: ({ value }) => formatScore(value),
  },
  {
    Header: 'Exception Created',
    accessor: 'dtCreated',
    Cell: ({ value }) => formatDate(value),
  },
  {
    Header: 'Exception ID',
    accessor: 'pkRiskRadarExceptions',
    Cell: ({ value }) => String(value),
  },
];
