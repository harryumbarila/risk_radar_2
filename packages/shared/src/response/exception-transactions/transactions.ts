export type TransactionResult = {
  transactionDate: Date; // Transaction date
  transactionAmount: number; // Transaction amount
  posEntryMode: string; // POS entry mode
  avsResponseCode: string; // AVS response code
  authCode: string; // Authorization code
  cardNumber: string; // Card number (masked)
  debitNetworkIdentifier: string; // Debit network identifier
  transactionId: string; // Transaction ID
  authAmount: number; // Authorization amount
  exceptionList: string; // List of exception codes
  exceptionTitle: string; // Exception title
  authResponseDescription: string; // Authorization response description
  binSearchMatchFlag: boolean; // BIN search match flag
  id?: string;
};

export type FSPTransaction = {
  exceptionId: string;
  type: string;
  TransactionDate: Date;
  Amount: number;
  sPaymentMethodDesc: string;
  sAVSRespDesc: string;
  AuthCode: string | null;
  First6: string;
  Last4: string;
  Network: string;
  txnID: string | null;
  sExceptionType: string;
};

export type TSYSTransactionFromBatch = {
  transactionDate: Date;
  transactionAmount: number;
  posEntryMode: string;
  sPOSEntryMode: string;
  avsResponseCode: string;
  diavsResponseCode: string;
  authCode: string;
  sCardNumF6: string;
  sCardNumL4: string;
  sDebitNetworkIdentifier: string;
  sTransID: string;
  dAuthAmt: number;
  iATPoints: number;
  iChbkExceedPoints: number;
  iDuplBINPoints: number;
  iDuplCardPoints: number;
  iFgnkeyedTransPoints: number;
  iKeyedPoints: number;
  iLatePostTransPoints: number;
  iMotoIoAVSPoints: number;
  iNoAuthTransPoints: number;
  iAuthCaptureAmtLargeVariationPoints: number;
};

export type TSYSTransactionFromDailyDetail = {
  transactionDate?: Date;
  transamount?: number;
  posmode?: string;
  sPOSEntryMode?: string;
  authnum?: string;
  cardnum_truncated?: string;
  transactionid?: string;
  authamt?: number;
  Definition?: string;
  avsResponseCode?: string;
  debitNetworkIdentifier?: string;
};

export type TSYSBatchAuthDates = {
  dtStartAuth: Date;
  dtEndAuth: Date;
};

export const TSYSIds = ['5611', '7905'];
export const FSPIds = ['8152'];

export const ExceptionTypeToNumber: Record<string, string> = {
  AVGTKT: '2',
  AUTHDECL: '3',
  AUTHDECLSAMECARD: '25',
  AUTHDECLSPECIFICREASON: '26',
  AUTHDECLGT5IN30MIN: '27',
  DUPBIN: '7',
  DUPCARD: '8',
  DUPCARDIN30DAYS: '28',
  DUPCARDSWIPETHENKEYEDIN30DAYS: '29',
  FOREIGNKEYED: '9',
  KEYEDTRANSAMTABVLIMIT: '10',
  MOTOIOAAVS: '12',
  AVGBAT: '4',
};
