export type TransactionData = {
  mid: string;
  transmissionDate?: Date | string;
  transactionDate?: Date | string;
  amount: number;
  posEntryMode?: string;
  avsResponseCode?: string;
  authCode: string;
  cardNumber: string;
  debitNetworkIdentifier?: string;
  netDepositAmount?: number;
  issuerBank?: string;
  issuerCountry?: string;
  issuerPhone?: string;
};
