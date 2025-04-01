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

  public async getExceptionTransactions(riskRadarExceptionId: number) {
    const exception = await this.riskRadarExceptionsJeff.findOne({
      where: { id: riskRadarExceptionId },
      select: ['mid', 'fundingDate', 'achFundingTime', 'createdAt'],
    });

    if (!exception) {
      throw new Error(`Exception with ID ${riskRadarExceptionId} not found`);
    }

    const dayOfTheFunding = format(exception.fundingDate, 'EEE');

    const cycleFiles = await this.getCycleFilesToProcess(
      dayOfTheFunding,
      exception.achFundingTime,
      exception.fundingDate
    );

    const cycleFilesDates = cycleFiles.map((e) => e.transmissionDate);
    const cycleFilesCycles = cycleFiles.map((e) => e.cycle);

    const cycleBatches =
      await this.batchRepository.getBatchIdsForDatesAndCycles(
        exception.mid,
        cycleFilesDates,
        cycleFilesCycles
      );

    const batchIds = cycleBatches.map((b) => b.pkDFT256Batch);
    const batches = await this.batchRepository.getBatches(batchIds);
    const transactions =
      await this.transactionRepository.getTransactionForBatchIds(batchIds);

    return { batches, transactions };

    // const trData = this.transformBatchesAndTransactions(batches, transactions);
  }

  public determineAuthTimes(dtExceptionCreated: Date) {
    const day = getDay(dtExceptionCreated); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const hour = getHours(dtExceptionCreated);

    let dtStartAuth: Date;
    let dtEndAuth: Date;

    if ([2, 3, 4, 5].includes(day) && hour >= 8 && hour <= 16) {
      // Tue - Fri
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 1), 20), 45),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 59),
        0
      );
    } else if (day === 1 && hour >= 8 && hour <= 16) {
      // Monday
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 1), 7), 30),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 59),
        0
      );
    } else if (day === 0) {
      // Sunday
      dtStartAuth = setSeconds(
        setMinutes(setHours(subDays(dtExceptionCreated, 2), 20), 45),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 7), 29),
        0
      );
    } else if ([1, 2, 3, 4, 5].includes(day) && hour >= 17 && hour <= 19) {
      // Mon - Fri (17-19)
      dtStartAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 8), 0),
        0
      );
      dtEndAuth = setSeconds(
        setMinutes(setHours(dtExceptionCreated, 17), 49),
        0
      );
    } else if ([1, 2, 3, 4, 5].includes(day) && hour >= 20 && hour <= 23) {
      // Mon - Fri (20-23)
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
    // Fetch data from DB
    const records = await this.cycleTimeMonitorRepository.find({
      where: {
        dayOfTheFunding,
        achFundingTime,
      },
      select: ['dateDiffFundingVsTransmissionCycle', 'cycle', 'accountType'],
    });

    // Process data
    const processedData = records.map((record) => ({
      transmissionDate: addDays(
        fundingDate,
        record.dateDiffFundingVsTransmissionCycle
      ),
      cycle: record.cycle,
      accountType: record.accountType,
    }));

    return processedData;
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
      .filter(Boolean) // Remove empty strings
      .join(''); // Join them into a single string

    return exceptionList;
  }

  // public transformBatchesAndTransactions(
  //   batches: RiskRadarBatch[],
  //   transactions: RiskRadarTransaction[]
  // ) {
  //   const sExceptionList = [
  //     transaction.atPoints ? '2 ' : '',
  //     batch.chbkExceedPoints ? '5 ' : '',
  //     transaction.duplBINPoints ? '7 ' : '',
  //     transaction.duplCardPoints ? '8 ' : '',
  //     transaction.fgnkeyedTransPoints ? '9 ' : '',
  //     batch.keyedPoints ? '10 ' : '',
  //     transaction.latePostTransPoints ? '11 ' : '',
  //     transaction.motoIoAVSPoints ? '12 ' : '',
  //     transaction.noAuthTransPoints ? '18 ' : '',
  //     transaction.authCaptureAmtLargeVariationPoints ? '21' : '',
  //   ]
  //     .filter(Boolean) // Remove empty strings
  //     .join(''); // Join them into a single string

  //   console.log(sExceptionList);
  // }

  // public async sortData(sortBy: number, sortOrder: SortType) {
  //   //
  // }
}
