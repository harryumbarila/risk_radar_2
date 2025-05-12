import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class S3PaginationInput {
  @ApiProperty({
    description: 'The prefix/folder path to list',
    required: false,
    example: 'documents/',
  })
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiProperty({
    description: 'Continuation token for pagination',
    required: false,
    example: '1ueD5LqJZ7l5F6w3XpLmBk3qHJGZ1F2vTEXAMPLE=',
  })
  @IsOptional()
  @IsString()
  continuationToken?: string;

  @ApiProperty({
    description: 'Maximum number of keys to return per page (max: 1000)',
    required: false,
    default: 100,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxKeys?: number = 100;

  bucketName: string;
}

export class S3ObjectDto {
  @ApiProperty({ example: 'documents/report.pdf' })
  Key: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  LastModified: Date;

  @ApiProperty({ example: '"d41d8cd98f00b204e9800998ecf8427e"' })
  ETag: string;

  @ApiProperty({ example: 1024 })
  Size: number;

  @ApiProperty({ example: 'STANDARD' })
  StorageClass: string;
}

export class S3PaginatedResponseDto {
  @ApiProperty({ type: [S3ObjectDto] })
  objects: S3ObjectDto[];

  @ApiProperty({
    type: [String],
    example: ['documents/images/', 'documents/archives/'],
  })
  folders: string[];

  @ApiProperty({
    required: false,
    example: '1ueD5LqJZ7l5F6w3XpLmBk3qHJGZ1F2vTEXAMPLE=',
  })
  nextContinuationToken?: string;

  @ApiProperty({
    description: 'Whether there are more results to fetch',
    example: true,
  })
  isTruncated: boolean;

  @ApiProperty({
    description: 'Current prefix being listed',
    example: 'documents/',
  })
  currentPrefix: string;
}
