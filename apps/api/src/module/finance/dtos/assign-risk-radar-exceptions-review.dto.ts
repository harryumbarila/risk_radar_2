import { IsArray, IsString } from 'class-validator';

export class AssignRiskRadarExceptionsReviewDto {
  @IsArray()
  @IsString({ each: true })
  public exceptionIds: string[];

  @IsString()
  public user: string;
}
