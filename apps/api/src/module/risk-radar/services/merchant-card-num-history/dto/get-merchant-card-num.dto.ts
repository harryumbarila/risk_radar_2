import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

import { SortType } from '@/shared/request';
import { MerchantCardHistorySortBy } from '@/shared/response/risk-radar/merchant-card-num-history';

export class MerchantCardNumHistoryQueryDto {
  @IsString()
  public cardNumber: string;

  @IsEnum(MerchantCardHistorySortBy, {
    message: 'sortBy is not a valid SortOrder value',
  })
  public sortBy: MerchantCardHistorySortBy;

  @Transform(({ value }) => String(value).toUpperCase()) // Normalize input to uppercase
  @IsEnum(SortType, { message: 'sortType must be either ASC or DESC' })
  public sortType: SortType;
}
