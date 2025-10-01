import type { BaseModel } from '@denali/shared/src/common';

export interface NetSettlementSummaryHeader {
  sMID16Exist?: string | null;
  sDBA?: string | null;
  sMerchantBankRoutingNumber?: string | null;
  sMerchantBankAccountNumber?: string | null;
  sTIN?: string | null;
  divertFlag: boolean;
  divertReason?: string | null;
  netSettlementLabelTypeId?: number | null;
  uwNewAccountHoldAllowRiskToEdit: boolean;
}

export interface NetSettlementLabelType {
  id: number;
  name: string;
}

export interface NetSettlementTransactionRow extends BaseModel {
  pkTrans: number;
  fkTransParent?: string;
  category: string;
  dtTrans: string;
  dTransAmt: number;
  dBalanceAmt: number;
  dPendingAmt: number;
  dWriteOffAmt: number;
  sTransDivertReason?: string;
  dtCreated: Date;
  fkSourceKey: number;
  sCreatedBy?: string;
}

export interface NetSettlementSummary {
  header: NetSettlementSummaryHeader;
  transactions: NetSettlementTransactionRow[];
  matchingMIDs: string[];

  labels: NetSettlementLabelType[];
}

export interface NetSettlementBaseDto {
  mid: string;
  type: string;
  amount: number;
  note: string;
  user: string;
  checkType?: 'payed' | 'returned';
  writeOffType: 'risk' | 'regular';
  midXFixer: string;
  futureBalanceAmt: number;
}
