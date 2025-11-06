import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min } from 'class-validator';

import { PaginationInput, PaginationResponse } from '@/shared/common';
import { RiskSource } from '@/risk-radar-db/entities';

export class AutoHoldExceptionSummaryOutputDto {
  @ApiProperty({ description: 'Unique identifier of the record.' })
  id: number;

  @ApiProperty({
    description: 'Associated risk source details.',
    type: () => RiskSource,
  })
  source: RiskSource;

  @ApiProperty({
    description: 'Data source identifier (batch, file, etc.)',
    example: '20251106_001',
  })
  dataSourceIdentifier: string;

  @ApiProperty({
    description: 'Merchant ID associated with the record.',
    example: 'MID123456',
  })
  merchantId: string;

  @ApiProperty({
    description: 'Next-day transaction indicator.',
    example: 'Yes',
    nullable: true,
  })
  NXDY: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH01.',
    example: 'Yes',
    nullable: true,
  })
  AH01: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH02.',
    example: null,
    nullable: true,
  })
  AH02: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH03.',
    example: 'Yes',
    nullable: true,
  })
  AH03: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH04.',
    example: null,
    nullable: true,
  })
  AH04: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH05.',
    example: 'Yes',
    nullable: true,
  })
  AH05: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH06.',
    example: null,
    nullable: true,
  })
  AH06: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH07.',
    example: 'Yes',
    nullable: true,
  })
  AH07: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH10.',
    example: 'Yes',
    nullable: true,
  })
  AH10: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH11.',
    example: null,
    nullable: true,
  })
  AH11: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH12.',
    example: 'Yes',
    nullable: true,
  })
  AH12: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH14.',
    example: 'Yes',
    nullable: true,
  })
  AH14: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH15.',
    example: null,
    nullable: true,
  })
  AH15: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH16.',
    example: 'Yes',
    nullable: true,
  })
  AH16: string | null;

  @ApiProperty({
    description: 'Record creation date.',
    example: '2025-11-06T12:00:00.000Z',
  })
  createdAt: Date;
}

export class ListAutoHoldExceptionSummaryPaginationOutput
  implements PaginationResponse<AutoHoldExceptionSummaryOutputDto>
{
  @ApiProperty({
    description: 'List of paginated auto-hold exception summary records.',
    type: AutoHoldExceptionSummaryOutputDto,
    isArray: true,
  })
  data: AutoHoldExceptionSummaryOutputDto[];

  @ApiProperty({ description: 'Number of records returned in this page.' })
  count: number;

  @ApiProperty({ description: 'Total number of records available.' })
  total: number;

  @ApiProperty({ description: 'Current page number.' })
  page: number;

  @ApiProperty({ description: 'Total number of pages available.' })
  pageCount: number;
}

export class ListAutoHoldExceptionSummaryPaginationInput
  implements PaginationInput
{
  @ApiPropertyOptional({
    description: 'Page number (starts from 1).',
    example: 1,
    required: false,
  })
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page (limit).',
    example: 50,
    required: false,
  })
  @IsOptional()
  limit?: number = 50;

  @ApiPropertyOptional({
    description: 'Start date filter for createdAt (YYYY-MM-DD).',
    example: '2025-11-01',
    required: false,
  })
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date filter for createdAt (YYYY-MM-DD).',
    example: '2025-11-06',
    required: false,
  })
  @IsOptional()
  endDate?: Date;
}
