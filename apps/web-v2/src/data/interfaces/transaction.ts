import { BaseModel } from "./api";

export interface MerchantTransaction extends BaseModel {
  id: string;
  merchant: string;
  amount: string;
  exception: string;
  processor: string;
  mid: string;
  date: string;
  status: "Unreviewed" | "In Progress" | "Reviewed";
  // New fields for Transaction Review table
  dbaName?: string;
  uwDate?: string;
  channel?: string;
  reseller?: string;
  referralPartner?: string;
  solutionConsultant?: string;
  riskWatch?: boolean;
  newAccount?: boolean;
  divert?: boolean;
  nextDayFunding?: string;
  netDivertBalance?: string;
  source?: string;
  dataSourceIdentifier?: string;
  ahRuleApplied?: string[];
  autoHoldRuleApplied?: string[];
  createdBatchTrigger?: string;
}
