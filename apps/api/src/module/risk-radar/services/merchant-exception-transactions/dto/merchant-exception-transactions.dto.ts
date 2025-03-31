import { IsInt, IsString, Length } from 'class-validator';

export class MerchantExceptionTransactionsInputDto {
  @IsInt()
  public riskRadarExceptionId: number;

  @IsString()
  @Length(0, 6)
  public binSearch: string;

  @IsInt()
  public sortBy: number;
}
