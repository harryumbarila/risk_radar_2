import { Injectable } from '@nestjs/common';
import { InjectPinoLogger } from 'nestjs-pino';
import { Logger } from 'pino';

import { DFT256BatchRepository } from '@/finance-db/repositories';

@Injectable()
export class MerchantCardNumHistoryService {
  public constructor(
    @InjectPinoLogger(MerchantCardNumHistoryService.name)
    private readonly logger: Logger,

    private readonly dft256BatchRepository: DFT256BatchRepository
  ) {}

  public async getMerchantCardNumHistory(
    cardNumber: string,
    sortBy: number
  ): Promise<void> {
    const dft = await this.dft256BatchRepository.find({});

    this.logger.info(cardNumber, sortBy, dft);
  }
}
