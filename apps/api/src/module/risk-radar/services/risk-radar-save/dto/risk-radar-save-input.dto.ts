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

  @IsOptional()
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

  @IsOptional()
  @IsBoolean()
  public isPinnedNote: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 5)
  public clickedStatus?: string;

  @IsOptional()
  @IsBoolean()
  public isRiskWatch: boolean;

  @IsOptional()
  @IsBoolean()
  public isAutoHoldEnabled: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  public createdBy: string;
}
