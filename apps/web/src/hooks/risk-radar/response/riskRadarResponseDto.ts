export interface RiskRadarResponseDto {
  id: number;
  netDeposit: number;
  fspApprovedAuthAmount: number;
  authDeclineAmount: number;
  dba: string;
  activationDate: string;
  channel: string;
  reseller?: string;
  referralPartner?: string;
  solutionConsultant?: string;
  autoApproved?: boolean;
  riskWatch?: boolean;
  newAccount?: boolean;
  at?: number;
  ht?: number;
  credits?: number;
  channelRule?: string;
  keyedPercentage?: number;
}
