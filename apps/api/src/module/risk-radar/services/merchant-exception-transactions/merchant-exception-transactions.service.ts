import { Injectable } from '@nestjs/common';
import {
  addDays,
  format,
  getDay,
  getHours,
  setHours,
  setMinutes,
  setSeconds,
  subDays,
} from 'date-fns';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import {
  CLXReportingSearchAVSResponseLookupRepository,
  CLXReportingSearchPaymentMethodLookupRepository,
} from '@/data-warehouse-db/repositories';
import type {
  RiskRadarBatch,
  RiskRadarTransaction,
} from '@/finance-db/entities';
import {
  AuthResponseLookupRepository,
  DailyDetailRepository,
  FSPRiskRadarExceptionPointsRepository,
  POSEntryModesADFRepository,
  RiskRadarBatchRepository,
  RiskRadarCycleTimeMonitorRepository,
  RiskRadarExceptionsJeffRepository,
  RiskRadarTransactionRepository,
} from '@/finance-db/repositories';

import type { MerchantExceptionTransactionsInputDto } from './dto/merchant-exception-transactions.dto';

type TransactionResult = {
  transactionDate: Date;
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
};

@Injectable()
export class MerchantExceptionTransactionsService {
  public constructor(
    @InjectPinoLogger(MerchantExceptionTransactionsService.name)
    private readonly logger: Logger,
    private readonly batchRepository: RiskRadarBatchRepository,
    private readonly clxReportingSearchAvgRepository: CLXReportingSearchAVSResponseLookupRepository,
    private readonly clxReportingSearchPaymentMethodRepository2: CLXReportingSearchPaymentMethodLookupRepository,
    private readonly authResponseLookupRepository: AuthResponseLookupRepository,
    private readonly dailyDetailRepository: DailyDetailRepository,
    private readonly posEntryModesRepository: POSEntryModesADFRepository,
    private readonly cycleTimeMonitorRepository: RiskRadarCycleTimeMonitorRepository,
    private readonly exceptionPointsRepository: FSPRiskRadarExceptionPointsRepository,
    private readonly riskRadarExceptionsJeff: RiskRadarExceptionsJeffRepository,
    private readonly transactionRepository: RiskRadarTransactionRepository
  ) {}

  public async getExceptionTransactions(
    data: MerchantExceptionTransactionsInputDto
  ): Promise<TransactionResult[]> {
    const { riskRadarExceptionId, binSearch, sortBy } = data;

    if (Math.abs(sortBy) > 9) {
      throw new Error('Invalid sortBy value. Must be between -9 and 9');
    }

    const exception = await this.riskRadarExceptionsJeff.findOne({
      where: { id: riskRadarExceptionId },
      select: ['mid', 'fundingDate', 'achFundingTime', 'createdAt'],
    });

    if (!exception) {
      throw new Error(`Exception with ID ${riskRadarExceptionId} not found`);
    }

    const dayOfTheFunding = format(exception.fundingDate, 'EEE');
    const { dtStartAuth, dtEndAuth } = this.determineAuthTimes(
      exception.createdAt
    );

    // Get cycle files to process
    const cycleFiles = await this.getCycleFilesToProcess(
      dayOfTheFunding,
      exception.achFundingTime,
      exception.fundingDate
    );

    // Get batches for the cycle files
    const cycleBatches = await this.getBatchesForCycleFiles(
      exception.mid,
      cycleFiles
    );

    // Get transactions from risk radar
    const riskRadarTransactions = await this.getRiskRadarTransactions(
      cycleBatches,
      binSearch
    );

    // Get declined auth transactions
    const declinedAuthTransactions = await this.getDeclinedAuthTransactions(
      exception.mid,
      dtStartAuth,
      dtEndAuth,
      binSearch
    );

    // Get CLX transactions
    const clxTransactions = this
      .getCLXTransactions
      // exception.mid,
      // dtStartAuth,
      // dtEndAuth,
      // exception.fundingDate,
      // exception.achFundingTime,
      // binSearch
      ();

    // Combine all transactions
    const allTransactions = [
      ...riskRadarTransactions,
      ...declinedAuthTransactions,
      ...clxTransactions,
    ];

    // Sort transactions
    return this.sortTransactions(allTransactions, sortBy);
  }

  private async getBatchesForCycleFiles(
    mid: string,
    cycleFiles: { transmissionDate: Date; cycle: string }[]
  ) {
    const cycleFilesDates = cycleFiles.map((e) => e.transmissionDate);
    const cycleFilesCycles = cycleFiles.map((e) => e.cycle);

    return this.batchRepository.getBatchIdsForDatesAndCycles(
      mid,
      cycleFilesDates,
      cycleFilesCycles
    );
  }

  private async getRiskRadarTransactions(
    batches: RiskRadarBatch[],
    binSearch: string
  ): Promise<TransactionResult[]> {
    const batchIds = batches.map((b) => b.pkDFT256Batch);

    const [batchDetails, transactions] = await Promise.all([
      this.batchRepository.getBatches(batchIds),
      this.transactionRepository.getTransactionForBatchIds(batchIds),
    ]);

    return transactions.map((transaction) => {
      const batch = batchDetails.find(
        (b) => b.pkDFT256Batch === transaction.batchId
      );
      const exceptionInfo = this.getExceptionListForBatchAndTransaction(
        batch,
        transaction
      );

      return {
        transactionDate: transaction.transactionDate,
        transactionAmount: transaction.transactionAmount,
        posEntryMode: transaction.posEntryMode,
        avsResponseCode:
          transaction.avsResponseCode || transaction.diaAvsResponseCode || '',
        authCode: transaction.authorizationCode || '',
        cardNumber: `${transaction.cardFirstSixDigits}******${transaction.cardLastFourDigits}`,
        debitNetworkIdentifier: transaction.debitNetworkIdentifier || '',
        transactionId: transaction.transactionIdentifier?.slice(-4) || '',
        authAmount: transaction.authorizationAmount || 0,
        exceptionList: exceptionInfo.exceptionList,
        exceptionTitle: exceptionInfo.exceptionTitle,
        authResponseDescription: '',
        binSearchMatchFlag: (transaction.cardFirstSixDigits || '').startsWith(
          binSearch
        ),
      };
    });
  }

  private async getDeclinedAuthTransactions(
    mid: string,
    startDate: Date,
    endDate: Date,
    binSearch: string
  ): Promise<TransactionResult[]> {
    const transactions =
      await this.dailyDetailRepository.findDeclinedAuthTransactions(
        mid,
        startDate,
        endDate
      );

    return transactions.map((tr) => ({
      transactionDate: tr.transactionDate,
      transactionAmount: tr.transactionAmount || 0,
      posEntryMode: tr.posMode || '',
      avsResponseCode: '',
      authCode: tr.authorizationNumber || '',
      cardNumber: tr.truncatedCardNumber?.replace(/x/g, '*') || '',
      debitNetworkIdentifier: '',
      transactionId: tr.transactionIdentifier?.slice(-4) || '',
      authAmount: tr.authorizationAmount || 0,
      exceptionList: '3',
      exceptionTitle: 'Auth Decl',
      authResponseDescription: '',
      binSearchMatchFlag: (tr.truncatedCardNumber || '').startsWith(binSearch),
    }));
  }

  private getCLXTransactions() // mid: string,
  // startDate: Date,
  // endDate: Date,
  // fundingDate: Date,
  // achFundingTime: string,
  // binSearch: string
  : TransactionResult[] {
    // Implementation for CLX transactions would go here
    // This would involve querying the CLX reporting search tables
    return [] as TransactionResult[];
  }

  private sortTransactions(
    transactions: TransactionResult[],
    sortBy: number
  ): TransactionResult[] {
    const sortField = Math.abs(sortBy);
    const sortDirection = sortBy >= 0 ? 'asc' : 'desc';

    const fieldMap = {
      1: 'transactionDate',
      2: 'transactionAmount',
      3: 'posEntryMode',
      4: 'avsResponseCode',
      5: 'authCode',
      6: 'cardNumber',
      7: 'debitNetworkIdentifier',
      8: 'transactionId',
      9: 'authAmount',
    };

    const field = fieldMap[sortField] as keyof TransactionResult;
    if (!field) return transactions;

    return [...transactions].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (sortDirection === 'asc') {
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
      }
      if (bVal < aVal) return -1;
      if (bVal > aVal) return 1;
      return 0;
    });
  }

  public determineAuthTimes(dtExceptionCreated: Date) {
    const day = getDay(dtExceptionCreated);
    const hour = getHours(dtExceptionCreated);

    let dtStartAuth: Date;
    let dtEndAuth: Date;

    if ([2, 3, 4, 5].includes(day) && hour >= 8 && hour <= 16) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 1), 20), 45),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 59),
        0
      );
    } else if (day === 1 && hour >= 8 && hour <= 16) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 1), 7), 30),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 59),
        0
      );
    } else if (day === 0) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 2), 20), 45),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 29),
        0
      );
    } else if ([1, 2, 3, 4, 5].includes(day) && hour >= 17 && hour <= 19) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 8), 0),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 17), 49),
        0
      );
    } else if ([1, 2, 3, 4, 5].includes(day) && hour >= 20 && hour <= 23) {
      dtStartAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 17), 50),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 20), 44),
        0
      );
    } else {
      throw new Error('No matching condition found for dtExceptionCreated.');
    }

    return { dtStartAuth, dtEndAuth };
  }

  public async getCycleFilesToProcess(
    dayOfTheFunding: string,
    achFundingTime: string,
    fundingDate: Date
  ) {
    const records = await this.cycleTimeMonitorRepository.find({
      where: {
        dayOfTheFunding,
        achFundingTime,
      },
      select: ['dateDiffFundingVsTransmissionCycle', 'cycle', 'accountType'],
    });

    return records.map((record) => ({
      transmissionDate: addDays(
        fundingDate,
        record.dateDiffFundingVsTransmissionCycle
      ),
      cycle: record.cycle,
      accountType: record.accountType,
    }));
  }

  public getExceptionListForBatchAndTransaction(
    batch: RiskRadarBatch,
    transaction: RiskRadarTransaction
  ) {
    const exceptionList = [
      transaction.atPoints ? '2 ' : '',
      batch.iChbkExceedPoints ? '5 ' : '',
      transaction.duplicateBinPoints ? '7 ' : '',
      transaction.duplicateCardPoints ? '8 ' : '',
      transaction.foreignKeyedTransactionPoints ? '9 ' : '',
      batch.iKeyedPoints ? '10 ' : '',
      transaction.latePostedTransactionPoints ? '11 ' : '',
      transaction.motoIoAvsPoints ? '12 ' : '',
      transaction.noAuthorizationTransactionPoints ? '18 ' : '',
      transaction.authCaptureAmountLargeVariationPoints ? '21' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const exceptionTitle = [
      transaction.atPoints ? 'AT' : '',
      batch.iChbkExceedPoints ? 'CB/RR' : '',
      transaction.duplicateBinPoints ? 'Dupl BIN' : '',
      transaction.duplicateCardPoints ? 'Dupl Card' : '',
      transaction.foreignKeyedTransactionPoints ? 'Foreign Keyed' : '',
      batch.iKeyedPoints ? 'Keyed %' : '',
      transaction.latePostedTransactionPoints ? 'Late Post' : '',
      transaction.motoIoAvsPoints ? 'MOTO AVS' : '',
      transaction.noAuthorizationTransactionPoints ? 'No Auth' : '',
      transaction.authCaptureAmountLargeVariationPoints
        ? 'Settle Amt more than 20% of Auth Amt'
        : '',
    ]
      .filter(Boolean)
      .join(' - ');

    return { exceptionList, exceptionTitle };
  }
}
