import { IsString } from 'class-validator';

export class RiskRadarExceptionListRequestDto {
  @IsString()
  public exceptionList: string;
}

export class RiskRadarExceptionListResponseDto {
  public id: number;
  public description: string;
  public isSelected: boolean;
}
