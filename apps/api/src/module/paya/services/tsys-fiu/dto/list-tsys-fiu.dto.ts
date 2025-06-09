import type { PaginationInput, PaginationResponse } from '@denali/shared';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

import { TsysFiuFile } from '@/paya-db/entities';

export class ListTsysPaginationOutput
  implements PaginationResponse<TsysFiuFile>
{
  @ApiProperty({
    description: 'Total pages of pagination',
    required: false,
    type: TsysFiuFile,
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
  public data: TsysFiuFile[];

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

export class ListTsysPaginationInput implements PaginationInput {
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
