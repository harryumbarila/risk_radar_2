import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PaginationInput, PaginationResponse } from '@/shared/common';

export class RiskRuleParamValueOutputDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  effectiveDate: Date;

  @ApiProperty()
  definition: string;

  @ApiProperty()
  value: number;
}

export class RiskSourceOutputDto {
  @ApiProperty()
  definition: string;
}

export class RiskRuleTypeOutputDto {
  @ApiProperty()
  definition: string;

  @ApiPropertyOptional({ required: false })
  code?: string;
}

export class RiskRuleOutputDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  definition: string;

  @ApiProperty({ type: () => RiskSourceOutputDto })
  source: RiskSourceOutputDto;

  @ApiProperty({ type: () => RiskRuleTypeOutputDto })
  ruleType: RiskRuleTypeOutputDto;

  @ApiProperty({ type: () => RiskRuleParamValueOutputDto, isArray: true })
  paramValues: RiskRuleParamValueOutputDto[];
}

export class ListRiskRulesPaginationOutput
  implements PaginationResponse<RiskRuleOutputDto>
{
  @ApiProperty({
    description: 'Total pages of pagination',
    required: false,
    type: RiskRuleOutputDto,
    isArray: true,
  })
  public data: RiskRuleOutputDto[];

  @ApiProperty({
    description: 'Total pages of pagination',
    type: Number,
    required: false,
  })
  public count: number;

  @ApiProperty({
    description: 'Total pages of pagination',
    type: Number,
    required: false,
  })
  public total: number;

  @ApiProperty({
    description: 'Total pages of pagination',
    type: Number,
    required: false,
  })
  public page: number;

  @ApiProperty({
    description: 'Total pages of pagination',
    type: Number,
    required: false,
  })
  public pageCount: number;
}

export class ListRiskRulesPaginationInput implements PaginationInput {
  @ApiPropertyOptional({
    description: 'Total pages of pagination',
    required: false,
  })
  @IsOptional()
  public page?: number = 1;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Limit of records',
    required: false,
  })
  public limit?: number = 50;
}
