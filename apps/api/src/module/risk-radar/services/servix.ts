// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { RiskRadarIssuingBank } from '../entities/RiskRadarIssuingBank';
// import { DFT256Batch } from '../entities/DFT256Batch';
// import { DFT256Transaction } from '../entities/DFT256Transaction';
// import { CLXReportingSearch } from '../entities/CLXReportingSearch';
// import { DFT256TransactionFromLegacySystem } from '../entities/DFT256TransactionFromLegacySystem';

// @Injectable()
// export class RiskRadarService {
//   constructor(
//     @InjectRepository(RiskRadarIssuingBank)
//     private readonly issuingBankRepo: Repository<RiskRadarIssuingBank>,
//     @InjectRepository(DFT256Batch)
//     private readonly batchRepo: Repository<DFT256Batch>,
//     @InjectRepository(DFT256Transaction)
//     private readonly transactionRepo: Repository<DFT256Transaction>,
//     @InjectRepository(CLXReportingSearch)
//     private readonly clxRepo: Repository<CLXReportingSearch>,
//     @InjectRepository(DFT256TransactionFromLegacySystem)
//     private readonly legacyTransactionRepo: Repository<DFT256TransactionFromLegacySystem>
//   ) {}

//   async getMerchantCardNumHistory(cardNum: string, sortBy: number) {
//     const cardNumF6 = cardNum.slice(0, 6);
//     const cardNumL4 = cardNum.slice(-4);

//     // Fetch issuer bank details
//     const issuerBank = await this.issuingBankRepo.findOne({
//       where: { bin: cardNumF6 },
//     });

//     // Fetch transactions from different sources
//     const transactions = await this.transactionRepo.find({
//       where: { cardNumF6, cardNumL4 },
//       relations: ['batch'],
//     });

//     const clxTransactions = await this.clxRepo.find({
//       where: { accountNumber: cardNum },
//     });

//     const legacyTransactions = await this.legacyTransactionRepo.find({
//       where: { cardNumF6, cardNumL4 },
//     });

//     // Merge results & mask card number
//     const results = [
//       ...transactions.map((t) =>
//         this.formatTransaction(t, t.batch?.netDepositAmount || 0)
//       ),
//       ...clxTransactions.map((t) => this.formatCLXTransaction(t)),
//       ...legacyTransactions.map((t) =>
//         this.formatTransaction(t, t.netDepositAmount)
//       ),
//     ];

//     // Apply sorting
//     results.sort((a, b) => this.sortTransactions(a, b, sortBy));

//     return { issuerBank, transactions: results };
//   }

//   private formatTransaction(
//     t: DFT256Transaction | DFT256TransactionFromLegacySystem,
//     netDepositAmount: number
//   ) {
//     return {
//       merchantId: t.merchantId,
//       transactionDate: t.transactionDate,
//       amount: t.amount,
//       posEntryMode: t.posEntryMode,
//       avsResponseCode: t.avsResponseCode,
//       authCode: t.authCode,
//       cardNum: `${t.cardNumF6}******${t.cardNumL4}`,
//       debitNetworkIdentifier: t.debitNetworkIdentifier,
//       netDepositAmount,
//     };
//   }

//   private formatCLXTransaction(t: CLXReportingSearch) {
//     return {
//       merchantId: t.siteId,
//       transactionDate: t.transactionDate,
//       amount: t.amount,
//       posEntryMode: t.posData,
//       authCode: t.authCode,
//       cardNum: `${t.accountNumber.slice(0, 6)}******${t.accountNumber.slice(-4)}`,
//       debitNetworkIdentifier: t.drdNetwork,
//       netDepositAmount: 0,
//     };
//   }

//   private sortTransactions(a: any, b: any, sortBy: number) {
//     const sortFields = [
//       'merchantId',
//       'transactionDate',
//       'amount',
//       'posEntryMode',
//       'avsResponseCode',
//       'authCode',
//       'cardNum',
//       'debitNetworkIdentifier',
//       'netDepositAmount',
//     ];
//     const field = sortFields[Math.abs(sortBy) - 1];
//     return sortBy > 0
//       ? a[field].localeCompare(b[field])
//       : b[field].localeCompare(a[field]);
//   }
// }
export const service = {};
