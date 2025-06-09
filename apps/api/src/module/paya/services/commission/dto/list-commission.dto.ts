import type { PaginationInput, PaginationResponse } from '@denali/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { PayaMonthlyResidualMetadata } from '@/paya-db/entities';

export class ListCommissionPaginationOutput
  implements PaginationResponse<PayaMonthlyResidualMetadata>
{
  @ApiProperty({
    description: 'Monthly residual commission data',
    required: false,
    type: PayaMonthlyResidualMetadata,
    isArray: true,
    example: {
      id: 'string',
      createdAt: '2025-05-29T17:50:14.746Z',
      updatedAt: '2025-05-29T17:50:14.746Z',
      fileId: 70,
      fileMonth: '2025-05-01',
      originalS3Key: '13618_Gobal_Group_Payout_Monthly_Terminal_05272025_filled_by_cris.xls',
      summaryExcelS3Key: 'monthly_residual_reports/2025/05/13618_Gobal_Group_Payout_Monthly_Terminal_05272025_filled_by_cris_summary_20250605_004427.xlsx',
      contentHash: '4ba0530b7a98e15d1c7fc91a566ce5be1eb60897817f2a9a2e2a7db35a6c6414',
      fileSizeBytes: 6081,
      recordCount: 21,
      revenueTotal: 12.32,
      expenseTotal: 0.00,
      uploaderUserName: null,
      downloaderUserName: null,
      uploaderIp: null,
      downloaderIp: null,
      downloadedAt: null,
      fileCategory: 'monthly_residual',
    },
  })
  public data: PayaMonthlyResidualMetadata[];

  @ApiProperty({
    description: 'Number of files in the current page',
    type: Number,
    required: false,
  })
  public count: number;

  @ApiProperty({
    description: 'Total number of files',
    type: Number,
    required: false,
  })
  public total: number;

  @ApiProperty({
    description: 'Current page number',
    type: Number,
    required: false,
  })
  public page: number;

  @ApiProperty({
    description: 'Total number of pages',
    type: Number,
    required: false,
  })
  public pageCount: number;
}

export class ListCommissionPaginationInput implements PaginationInput {
  @ApiPropertyOptional({
    description: 'Page number',
    required: false,
  })
  @IsOptional()
  public page?: number = 1;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Number of records per page',
    required: false,
  })
  public limit?: number = 50;
} 