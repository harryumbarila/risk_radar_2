import { Injectable } from '@nestjs/common';

import type {
  RiskRadarExceptionListRequestDto,
  RiskRadarExceptionListResponseDto,
} from '@/api/module/finance/dtos/risk-radar-exception-list.dto';
import { RiskRadarExceptionListLookupRepository } from '@/finance-db/repositories/risk-radar-exception-list-lookup.repository';

@Injectable()
 
export class RiskRadarExceptionListService {
  public constructor(
    private readonly lookupRepository: RiskRadarExceptionListLookupRepository
  ) {}

  /**
   * @migrated dbo.uspRiskRadarExceptionList.StoredProcedure.sql
   */
  public async getExceptionList(
    dto: RiskRadarExceptionListRequestDto
  ): Promise<RiskRadarExceptionListResponseDto[]> {
    const selectedIds = dto.exceptionList
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !Number.isNaN(id));

    return this.lookupRepository.getExceptionListWithSelection(selectedIds);
  }
}
