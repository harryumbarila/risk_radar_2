import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CommissionFileUploadDto {
  @ApiProperty({
    type: 'number',
    description: 'The numeric file ID',
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  public fileId: number;

  @ApiProperty({
    type: 'string',
    format: 'date',
    description: 'The month this file represents (YYYY-MM-DD format)',
    example: '2025-05-01',
  })
  @IsDateString()
  public fileMonth: string;

  @ApiProperty({
    type: 'string',
    description: 'The user name of the uploader',
  })
  @IsString()
  public userName: string;

  @ApiProperty({
    type: 'string',
    description: 'The date modified file to submitted',
  })
  @IsString()
  public modifiedAt: string;
} 