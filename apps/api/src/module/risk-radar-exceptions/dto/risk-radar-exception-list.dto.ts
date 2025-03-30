import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class RiskRadarExceptionsListDto {
  @Type(() => Date)
  @IsDate()
  public dtStart: Date;

  @Type(() => Date)
  @IsDate()
  public dtEnd: Date;

  @IsInt()
  public pkRiskRadarExceptionStatus: number;

  @IsInt()
  public pkRiskRadarUserAssigned: number;

  @IsOptional()
  @IsString()
  public sMIDSearch?: string;

  @IsOptional()
  @IsString()
  public sGeneralSearch?: string;

  @IsOptional()
  @IsString()
  public sExceptionList?: string;

  @IsBoolean()
  public bViewAll: boolean;

  @IsInt()
  public iSortBy: number;

  @IsInt()
  public iProcessor: number;
}
