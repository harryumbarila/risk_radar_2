import { Injectable } from '@nestjs/common';

import {
  RiskRadarExceptionsJeffRepository,
  RiskRadarMerchAdjParamRepository,
} from '@/finance-db/repositories';

import type { RiskRadarSaveInputDto } from './dto/risk-radar-save-input.dto';

@Injectable()
export class RiskRadarSaveService {
  public constructor(
    private readonly merchAdjRepository: RiskRadarMerchAdjParamRepository,
    private readonly exceptionsJeffRepository: RiskRadarExceptionsJeffRepository
  ) {}

  public async saveRiskRadar(data: RiskRadarSaveInputDto) {
    const { merchantId } = data;

    const merchAdj = await this.merchAdjRepository.findBy({
      merchantId,
    });

    return merchAdj;
  }
}
