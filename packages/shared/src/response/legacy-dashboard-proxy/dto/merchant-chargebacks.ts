export interface MerchantChargebacksResponseDto {
  pk: number;
  sMID: string;
  dtTrans: string;
  dAmt: number;
  sCardNum: string;
  dtReceived: string;
  sReferenceNum: number;
  cardNumber: number;
  dtCreated: string;
  sPaymentType: string;
  sCaseNumber: string;
  bP2ChargebacksExists: boolean;
  ReasonCodeDescription: string;
}
