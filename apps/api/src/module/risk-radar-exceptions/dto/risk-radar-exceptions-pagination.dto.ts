import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { RiskRadarExceptionsListResultDto } from './risk-radar-exceptions-list-result.dto';

export class PaginationMetaDto {
  @IsNumber()
  public records_per_page: number;

  @IsNumber()
  public current_page: number;

  @IsNumber()
  public last_page: number;

  @IsNumber()
  public from_record: number;

  @IsNumber()
  public to_record: number;
}

export class PaginatedRiskRadarExceptionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RiskRadarExceptionsListResultDto)
  public data: RiskRadarExceptionsListResultDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => PaginationMetaDto)
  public meta: PaginationMetaDto;
} 