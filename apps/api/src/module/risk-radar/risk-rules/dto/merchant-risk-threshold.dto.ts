import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { PaginationInput, PaginationResponse } from '@/shared/common';
import { MerchanRiskThresholdsEntity } from '@/risk-radar-db/entities';

export class ListMerchantRiskThresholdsInput implements PaginationInput {
  @ApiPropertyOptional({
    description: 'Filter by MID (partial match)',
    required: false,
  })
  @IsOptional()
  @IsString()
  mid?: string;

  @ApiPropertyOptional({
    description: 'Page number',
    required: false,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    required: false,
    default: 50,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 50;
}

export class ListMerchantRiskThresholdsOutput
  implements PaginationResponse<MerchanRiskThresholdsEntity>
{
  @ApiProperty({
    description: 'Merchant risk threshold records',
    type: MerchanRiskThresholdsEntity,
    isArray: true,
  })
  data: MerchanRiskThresholdsEntity[];

  @ApiProperty({
    description: 'Number of records in current page',
    type: Number,
  })
  count: number;

  @ApiProperty({
    description: 'Total number of records',
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Total number of pages',
    type: Number,
  })
  pageCount: number;
}
