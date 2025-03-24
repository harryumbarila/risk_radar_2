export interface MerchantChargebacksResponseDto {
  chargebacks: MerchantChargebacks[];
}

export interface MerchantChargebacks {
  pk: number;
  sMID: string;
  dTTrans: string;
  dAmt: number;
  sCardNum: string;
  dtReceived: string;
  sReferenceNum: number;
  cardNumber: number;
  dtCreated: string;
  sPaymentType: string;
  sCaseNumber: string;
  bP2ChargebacksExists: boolean;
}
