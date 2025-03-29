import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

enum SortOrder {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  NINE = 9,
  TEN = 10,
}

enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class MerchantCardNumHistoryQueryDto {
  @IsString()
  public cardNumber: string;

  @Transform(({ value }) => Number(value)) // Convert input to a number
  @IsEnum(SortOrder, { message: 'sortBy must be a value from 1 to 10' })
  public sortBy: SortOrder;

  @Transform(({ value }) => String(value).toUpperCase()) // Normalize input to uppercase
  @IsEnum(SortType, { message: 'sortType must be either "ASC" or "DESC"' })
  public sortType: SortType;
}
