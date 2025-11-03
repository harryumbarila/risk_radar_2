import { IsInt, IsString, Length } from "class-validator";

export class CreateOrUpdateMerchantRiskThresholdDto {
  @IsString()
  @Length(1, 16)
  public mid: string;

  @IsInt()
  public keyedPercentage: number;

  @IsInt()
  public monthlyVolume: number;

  @IsInt()
  public highTicket: number;

  @IsInt()
  public transactionCount: number;

  @IsInt()
  public declinePercentage: number;

  @IsString()
  @Length(1, 25)
  public lastUpdatedBy: string;
}

