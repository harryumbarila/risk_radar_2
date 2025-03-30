import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import {
  CLXReportingSearchAVSResponseLookupRepository,
  CLXReportingSearchPaymentMethodLookupRepository,
} from '@/data-warehouse-db/repositories';
import {
  AuthResponseLookupRepository,
  DailyDetailRepository,
  FSPRiskRadarExceptionPointsRepository,
  POSEntryModesADFRepository,
  RiskRadarBatchRepository,
  RiskRadarCycleTimeMonitorRepository,
} from '@/finance-db/repositories';

import type { MerchantExceptionTransactionsInputDto } from './dto/merchant-exception-transactions.dto';

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
    private readonly exceptionPointsRepository: FSPRiskRadarExceptionPointsRepository
  ) {}

  public async getExceptionTransactions(
    data: MerchantExceptionTransactionsInputDto
  ) {
    await this.batchRepository.find();

    this.logger.info('%o', data);
  }
}
