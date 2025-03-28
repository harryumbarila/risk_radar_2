import { IsArray, IsNumber, IsString } from 'class-validator';

export class AssignRiskRadarExceptionsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  public exceptionIds: number[];

  @IsNumber()
  public assignedUserId: number;

  @IsString()
  public user: string;
}
