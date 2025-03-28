import { Injectable } from '@nestjs/common';
import { RiskRadarExceptionListLookupRepository } from '@denali/finance-db/src/repositories/risk-radar-exception-list-lookup.repository';
import {
  RiskRadarExceptionListRequestDto,
  RiskRadarExceptionListResponseDto,
} from '../dtos/risk-radar-exception-list.dto';

@Injectable()
export class RiskRadarExceptionListService {
  constructor(
    private readonly lookupRepository: RiskRadarExceptionListLookupRepository
  ) {}

  /**
   * @migrated dbo.uspRiskRadarExceptionList.StoredProcedure.sql
   */
  async getExceptionList(
    dto: RiskRadarExceptionListRequestDto
  ): Promise<RiskRadarExceptionListResponseDto[]> {
    const selectedIds = dto.exceptionList
      .split(',')
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));

    return this.lookupRepository.getExceptionListWithSelection(selectedIds);
  }
}
