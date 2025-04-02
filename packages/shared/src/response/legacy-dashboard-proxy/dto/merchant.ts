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
  iHT$: number;
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
  sPreferredContact: string;
  bIsTalusPayMerchant: boolean;
  sSolutionConsultant: string;
  iUWApprCB: number;
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

export interface MerchantContactInfo {
  contact_name: string;
  contact_phone_number: string;
  contact_email_address: string;
  preferred_contact: string;
  website: string;
}

export interface MerchantResponseDto {
  merchant_profile: MerchantProfile[];
  volume: Volume[];
  exception_type_legend: ExceptionTypeLegend[];
  risk_exception: RiskException[];
}

export interface RiskException {
  pkRiskException: number;
  bDivert: boolean;
  bManagersQueue: boolean;
  bRiskWatch: boolean;
  bAutoHoldWhite: boolean;
  fkRiskExceptionStatus: number;
}

export interface ExceptionTypeLegend {
  ID: number;
  Exception: string;
}

export interface MerchantContactResponseDto {
  merchant_profile: MerchantContactInfo[];
}
