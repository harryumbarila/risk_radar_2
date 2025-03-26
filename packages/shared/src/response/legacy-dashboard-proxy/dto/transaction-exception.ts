export interface TransactionExceptionResponseDto {
  trans_exceptions: TransactionException[];
}

export interface TransactionException {
  pk: number;
  fkRiskException: number;
  sMId: string;
  dtTransDate: string;
  dAuthAmt: number;
  dTransAmt: number;
  sPOS: string;
  sAVS: string;
  sAuthCode: string;
  sCardNum: string;
  sCardNumExt: string;
  sPIN: number;
  sExceptions: string;
  sExceptionsDesc: string;
  dtCreated: string;
}
