import { File } from '@nest-lab/fastify-multer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class S3PaginationInput {
  @ApiPropertyOptional({
    description: 'The prefix/folder path to list',
    required: false,
    example: 'documents/',
  })
  @IsOptional()
  @IsString()
  public prefix?: string;

  @ApiPropertyOptional({
    description: 'Continuation token for pagination',
    required: false,
    example: '1ueD5LqJZ7l5F6w3XpLmBk3qHJGZ1F2vTEXAMPLE=',
  })
  @IsOptional()
  @IsString()
  public continuationToken?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of keys to return per page (max: 1000)',
    required: false,
    default: 100,
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  public maxKeys?: number = 100;

  @ApiPropertyOptional({
    description: 'Search term',
    required: false,
    default: 100,
    example: 100,
  })
  @IsOptional()
  @IsString()
  public searchTerm?: string;

  @Allow()
  public bucketName: string;
}

export class S3ObjectDto {
  @ApiProperty({ example: 'documents/report.pdf' })
  @IsDefined()
  @IsString()
  public Key: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
  })
  @IsDefined()
  @Type(() => Date)
  public LastModified: Date;

  @ApiProperty({ example: '"d41d8cd98f00b204e9800998ecf8427e"' })
  @IsDefined()
  @IsString()
  public ETag: string;

  @ApiProperty({ example: 1024 })
  @IsDefined()
  @IsNumber()
  public Size: number;

  @ApiProperty({ example: 'STANDARD' })
  @IsDefined()
  @IsString()
  public StorageClass: string;
}

export class S3PaginatedResponseDto {
  @ApiProperty({ type: S3ObjectDto, isArray: true })
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => S3ObjectDto)
  public objects: S3ObjectDto[];

  @ApiProperty({
    type: 'string',
    isArray: true,
    example: ['documents/images/', 'documents/archives/'],
  })
  @IsDefined()
  @IsArray()
  @IsString({ each: true })
  public folders: string[];

  @ApiPropertyOptional({
    required: false,
    example: '1ueD5LqJZ7l5F6w3XpLmBk3qHJGZ1F2vTEXAMPLE=',
  })
  @IsOptional()
  @IsString()
  public nextContinuationToken?: string;

  @ApiProperty({
    description: 'Whether there are more results to fetch',
    example: true,
  })
  @IsDefined()
  public isTruncated: boolean;

  @ApiProperty({
    description: 'Current prefix being listed',
    example: 'documents/',
  })
  @IsDefined()
  @IsString()
  public currentPrefix: string;
}

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to upload',
  })
  @IsObject()
  public file: File;

  @ApiProperty({ description: 'The unique key for the file' })
  @IsString()
  public key: string;
}
