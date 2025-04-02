import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ExceptionListInputDto {
  // Dates & system
  @Type(() => Date)
  @IsDate()
  public startDate: Date;

  @Type(() => Date)
  @IsDate()
  public endDate: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public processor?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  public viewAllExceptions?: boolean;

  // Exception type
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(
    ({ value }) =>
      Array.isArray(value) ? (value as string[]) : [String(value)] // Always array even if just 1 value passed
  )
  public categories: string[] = [];

  // Exception status | Assigned to user | MID | DBA/SIC
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public status?: number;

  @IsOptional()
  @IsString()
  @Length(1, 16)
  public merchantId?: string;

  @IsOptional()
  @IsString()
  public assignedToUser?: string;

  @IsOptional()
  @IsString()
  public dbaNameOrSIC?: string;

  // Pagination
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public pageSize?: number = 25;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public page?: number = 1;
}
