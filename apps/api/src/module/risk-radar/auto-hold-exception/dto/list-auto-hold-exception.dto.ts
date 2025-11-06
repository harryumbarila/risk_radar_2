import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

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
    description: 'Auto Hold flag AH001.',
    example: 'Yes',
    nullable: true,
  })
  AH001: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH002.',
    example: null,
    nullable: true,
  })
  AH002: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH003.',
    example: 'Yes',
    nullable: true,
  })
  AH003: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH004.',
    example: null,
    nullable: true,
  })
  AH004: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH005.',
    example: 'Yes',
    nullable: true,
  })
  AH005: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH006.',
    example: null,
    nullable: true,
  })
  AH006: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH007.',
    example: 'Yes',
    nullable: true,
  })
  AH007: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH008.',
    example: 'Yes',
    nullable: true,
  })
  AH008: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH009.',
    example: 'Yes',
    nullable: true,
  })
  AH009: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH010.',
    example: 'Yes',
    nullable: true,
  })
  AH010: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH011.',
    example: 'Yes',
    nullable: true,
  })
  AH011: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH012.',
    example: 'Yes',
    nullable: true,
  })
  AH012: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH013.',
    example: null,
    nullable: true,
  })
  AH013: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH014.',
    example: 'Yes',
    nullable: true,
  })
  AH014: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH015.',
    example: null,
    nullable: true,
  })
  AH015: string | null;

  @ApiProperty({
    description: 'Auto Hold flag AH016.',
    example: 'Yes',
    nullable: true,
  })
  AH016: string | null;

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
