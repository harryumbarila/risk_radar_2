import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class RiskRadarSaveInputDto {
  @IsString()
  @Length(1, 16)
  public merchantId: string;

  @IsInt()
  public exceptionId: number;

  @IsBoolean()
  public isDiverted: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  public preferredContact?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  public notes?: string;

  @IsBoolean()
  public isPinnedNote: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 5)
  public clickedStatus?: string;

  @IsBoolean()
  public isRiskWatch: boolean;

  @IsBoolean()
  public isAutoHoldEnabled: boolean;

  @IsString()
  @MaxLength(25)
  public createdBy: string;
}
