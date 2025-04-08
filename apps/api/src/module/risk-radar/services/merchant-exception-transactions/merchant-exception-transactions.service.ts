import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { RiskRadarExceptionsJeffRepository } from '@/finance-db/repositories';
import { SortType } from '@/shared/request';
import type { TransactionResult } from '@/shared/response';
import { FSPIds, TSYSIds } from '@/shared/response';

import type { MerchantExceptionTransactionsInputDto } from './dto/merchant-exception-transactions.dto';
import { FspExceptionTransactionService } from './fsp-exception-transaction.service';
import { TsysExceptionTransactionService } from './tsys-exception-transaction.service';

@Injectable()
export class MerchantExceptionTransactionsService {
  public constructor(
    @InjectPinoLogger(MerchantExceptionTransactionsService.name)
    private readonly logger: Logger,
    private readonly riskRadarExceptionsJeff: RiskRadarExceptionsJeffRepository,
    private readonly tsysExceptionTransactionService: TsysExceptionTransactionService,
    private readonly fspExceptionTransactionService: FspExceptionTransactionService
  ) {}

  public async getExceptionsTransactions(
    input: MerchantExceptionTransactionsInputDto
  ): Promise<TransactionResult[] | unknown[]> {
    const { riskRadarExceptionId, sortBy, sortType, binSearch } = input;

    const sortByColumn = sortBy ?? 'authAmount';
    const sortTypeColumn = sortType ?? SortType.DESC;

    const exception = await this.riskRadarExceptionsJeff.findOne({
      where: {
        id: riskRadarExceptionId,
      },
    });

    if (!exception) {
      throw new NotFoundException(
        `Exception with ID ${riskRadarExceptionId} not found`
      );
    }

    const first4Mid = exception.mid.slice(0, 4);
    const isTSYS = TSYSIds.includes(first4Mid);
    const isFSP = FSPIds.includes(first4Mid);

    if (isTSYS) {
      const transactions =
        await this.tsysExceptionTransactionService.getTSYSTransactionsForException(
          exception,
          binSearch
        );

      return this.sortTransactionsBy(transactions, sortByColumn, sortType);
    }

    if (isFSP) {
      const transactions =
        await this.fspExceptionTransactionService.getFSPTransactionsForException(
          exception,
          binSearch
        );

      return this.sortTransactionsBy(
        transactions,
        sortByColumn,
        sortTypeColumn
      );
    }

    throw new BadRequestException(
      `Invalid merchant for exception ${exception.mid}`
    );
  }

  private sortTransactionsBy(
    transactions: TransactionResult[],
    sortBy: keyof TransactionResult = 'transactionAmount',
    order: SortType = SortType.DESC
  ): TransactionResult[] {
    return [...transactions].sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      let comparison = 0;

      if (valueA instanceof Date && valueB instanceof Date) {
        comparison = valueA.getTime() - valueB.getTime();
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        if (valueA === valueB) {
          comparison = 0;
        } else {
          comparison = valueA ? 1 : -1;
        }
      }

      return order === SortType.ASC ? comparison : -comparison;
    });
  }
}
