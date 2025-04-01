export interface TransactionExceptionResponseDto {
  transactionDate: string;
  transactionAmount: number;
  posEntryMode: string;
  avsResponseCode: string;
  authCode: string;
  cardNumber: string;
  debitNetworkIdentifier: string;
  transactionId: string;
  authAmount: number;
  exceptionList: string;
  exceptionTitle: string;
  authResponseDescription: string;
  binSearchMatchFlag: boolean;
}
