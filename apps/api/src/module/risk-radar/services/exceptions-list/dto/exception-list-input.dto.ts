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
  public processor?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
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
  public status?: number; // TODO: If not dynamic move to enum

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
  public recordsPerPage?: number = 25;

  @IsOptional()
  @IsInt()
  public currentPage?: number = 1;
}
