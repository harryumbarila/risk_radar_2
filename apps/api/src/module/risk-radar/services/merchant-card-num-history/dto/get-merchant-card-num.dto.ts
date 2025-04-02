import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { SortType } from '@/shared/request';
import { MerchantCardHistorySortBy } from '@/shared/response/risk-radar/merchant-card-num-history';

export class MerchantCardNumHistoryQueryDto {
  @IsString()
  public cardNumber: string;

  @IsOptional()
  @IsEnum(MerchantCardHistorySortBy, {
    message: 'sortBy is not a valid SortOrder value',
  })
  public sortBy: MerchantCardHistorySortBy =
    MerchantCardHistorySortBy.TRANSACTION_DATE;

  @Transform(({ value }) => String(value).toUpperCase()) // Normalize input to uppercase
  @IsOptional()
  @IsEnum(SortType, { message: 'sortType must be either ASC or DESC' })
  public sortType: SortType = SortType.DESC;
}
