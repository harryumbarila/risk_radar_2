export interface MerchantProfile {
  pk: number;
  sMId: string;
  sDBAName: string;
  sDBAAddress: string;
  sDBACity: string;
  sDBAState: string;
  sDBAZip: string;
  sOwnershipType: string;
  sSIC: string;
  sSICDesc: string;
  sSelfgen: string;
  sMerchantType: string;
  sActivationDate: string;
  iMV$: number;
  iAT$: number;
  iSwipeVolPerc: number;
  iCB: number;
  iRR: number;
  bDivert: boolean;
  sCashAdvEnrolled: string;
  bRiskWatch: boolean;
  dNetSettlementBal: number;
  iSwipedPercBasedOnTransCntCurrMonth: number | null;
  sChannel: string;
  sReseller: string;
  sReferralPartner: string;
  sISA: string;
  iUWApprMV: number;
  iUWApprAT: number;
  iUWApprSwipeVolPerc: number;
  bAutoHoldWhiteLabel: boolean;
  iUWApprHT: number;
  dtCreated: string;
  dtLastUpdated: string;
}

export interface Volume {
  pk: number;
  sMId: string;
  iYear: number;
  iMonth: number;
  sMonth: string;
  dVol: number;
  dAvgTkt: number;
  dSwipedPercBasedOnTransCnt: number;
  dHighestTkt: number;
  dTotCB: number;
  dVCBPerc: number;
  dMCCBPerc: number;
  dDCBPerc: number;
  dACBPerc: number;
}

export interface MerchantResponseDto {
  merchant_profile: MerchantProfile[];
  volume: Volume[];
}
