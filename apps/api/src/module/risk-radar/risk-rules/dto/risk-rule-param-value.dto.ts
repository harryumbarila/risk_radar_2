import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PaginationResponse } from '@/shared/common';
import { RiskRuleParamValue } from '@/risk-radar-db/entities';

import { ListRiskRulesPaginationInput } from './risk-rules.dto';

export class ListRiskRuleParamValuesInput extends ListRiskRulesPaginationInput {
  @ApiPropertyOptional({
    description: 'Filter by risk rule parameter ID (fk_risk_rules_params)',
    required: false,
  })
  @IsOptional()
  ruleParamId?: number;
}

export class RiskRuleParamValuePaginationOutputDto extends PickType(
  RiskRuleParamValue,
  ['id', 'value', 'ruleParamId', 'effectiveDate', 'createdBy', 'createdAt']
) {}

export class ListRiskRuleParamValuesOutput
  implements PaginationResponse<RiskRuleParamValuePaginationOutputDto>
{
  @ApiProperty({ type: RiskRuleParamValuePaginationOutputDto, isArray: true })
  data: RiskRuleParamValuePaginationOutputDto[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageCount: number;
}
