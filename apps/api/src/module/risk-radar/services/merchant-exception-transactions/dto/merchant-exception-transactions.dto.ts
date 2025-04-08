import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';

import { SortType } from '@/shared/request';
import type { TransactionResult } from '@/shared/response';

export class MerchantExceptionTransactionsInputDto {
  @IsInt()
  @Transform(({ value }) => Number(value))
  public riskRadarExceptionId: number;

  @IsString()
  @Length(0, 6)
  @IsOptional()
  public binSearch: string;

  @IsString()
  @Type(() => String)
  @IsOptional()
  public sortBy: keyof TransactionResult;

  @Transform(({ value }) => String(value).toUpperCase())
  @IsOptional()
  @IsEnum(SortType, { message: 'sortType must be either ASC or DESC' })
  public sortType: SortType = SortType.DESC;
}
