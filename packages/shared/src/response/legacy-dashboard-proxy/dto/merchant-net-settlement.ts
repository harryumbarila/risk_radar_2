export interface MerchantNetSettlementResponseDto {
  net_settlement: MerchantNetSettlement[];
  totalBalAmt: number;
}

export interface MerchantNetSettlement {
  pkNetSettlement: number;
  sTransCategory: string;
  dtTranDate: string;
  dTransAmt: number;
  dBalAmt: number;
  dPendingAmt: number;
  dWriteOffAmt: number;
  sReason: string;
  sCreatedBy: string;
  dtCreated: string;
  sMId: string;
}
