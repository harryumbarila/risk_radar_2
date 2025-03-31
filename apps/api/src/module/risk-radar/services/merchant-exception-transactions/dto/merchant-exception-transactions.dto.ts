import { IsInt, IsString } from 'class-validator';

export class MerchantExceptionTransactionsInputDto {
  @IsInt()
  public riskRadarExceptionId: number;

  @IsString()
  public binSearch: string;

  @IsInt()
  public sortBy: number;

  // @IsString()
  // @Length(1, 16)
  // public smid: string;

  // @Type(() => Date)
  // @IsDate()
  // public createdDate: Date;

  // @Type(() => Date)
  // @IsDate()
  // public startAuthDate: Date;

  // @Type(() => Date)
  // @IsDate()
  // public endAuthDate: Date;

  // @IsString()
  // @Length(1, 3)
  // public dayOfTheFunding: string;

  // @IsString()
  // @Length(1, 10)
  // public achFundingTime: string;

  // @Type(() => Date)
  // @IsDate()
  // public fundingDate: Date;

  // @Type(() => Date)
  // @IsDate()
  // public exceptionCreatedDate: Date;

  // @IsInt()
  // public count: number;

  // @Type(() => Date)
  // @IsDate()
  // public authStartDate: Date;

  // @Type(() => Date)
  // @IsDate()
  // public authEndDate: Date;

  // @Type(() => Date)
  // @IsDate()
  // public authStart30DaysDate: Date;
}
