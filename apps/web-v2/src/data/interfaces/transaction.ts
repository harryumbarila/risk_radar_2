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
  product?: string;
  isv?: string;
  ahRuleApplied?: string[];
  autoHoldRuleApplied?: string[];
  createdBatchTrigger?: string;
  createdBatchDate?: string; // Date string for batch creation date
  // Transaction details for email templates
  cardNumber?: string; // Full masked card number (e.g., "****1234" or "123456 •••• 7890")
  cardLastFour?: string; // Last 4 digits of card
  cardFirstSix?: string; // First 6 digits of card
  avsCode?: string; // AVS response code (e.g., "Y", "N", "Z", "A")
  avsResult?: string; // Full AVS result (e.g., "Y - Match", "N - No Match")
  authCode?: string; // Authorization code
}
