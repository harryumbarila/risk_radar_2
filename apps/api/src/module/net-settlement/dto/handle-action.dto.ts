import {
  Allow,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class NetSettlementBaseDto {
  @IsString()
  @MaxLength(16)
  public mid: string;

  @IsString()
  public type: string;

  @IsNumber()
  public amount: number;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  public note: string;

  @IsString()
  @MaxLength(25)
  public user: string;

  @Allow()
  @IsOptional()
  public checkType?: 'payed' | 'returned';

  @Allow()
  public writeOffType: 'risk' | 'regular';

  @Allow()
  public midXFixer: string;

  @Allow()
  public futureBalanceAmt: number;
}

export class NetSettlementBaseOutput {
  public success: boolean;

  public message?: string;
}
