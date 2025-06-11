import type { PaginationInput, PaginationResponse } from '@denali/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { CommissionFile } from '@/paya-db/entities';

export class ListCommissionPaginationOutput
  implements PaginationResponse<CommissionFile>
{
  @ApiProperty({
    description: 'Commission files and variants',
    required: false,
    type: CommissionFile,
    isArray: true,
    example: {
      id: 'string',
      createdAt: '2025-05-29T17:50:14.746Z',
      updatedAt: '2025-05-29T17:50:14.746Z',
      fileName: 'string',
      variants: [
        {
          id: 'string',
          createdAt: '2025-05-29T19:59:04.564Z',
          updatedAt: '2025-05-29T19:59:04.564Z',
          fileId: 'string',
          variantType: 'PROVIDED',
          s3DirectoryPath: 'string',
          contentsHash: 'string',
          uploaderIp: null,
          downloadedAt: null,
          downloaderIp: null,
          modifiedAt: null,
        },
      ],
    },
  })
  public data: CommissionFile[];

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
