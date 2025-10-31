import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { RiskRuleParamValue } from '@/risk-radar-db/entities';
import {
  IsInt,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRiskRuleParamValueDto {
  @ApiProperty({
    description: 'Foreign key referencing the related rule parameter.',
    example: 10,
  })
  @IsInt()
  ruleParamId: number;

  @ApiProperty({
    description: 'Numeric value assigned to this parameter.',
    example: 250,
  })
  @IsInt()
  value: number;

  @ApiProperty({
    description: 'Date from which this parameter value is effective.',
    example: '2025-10-31T17:29:00Z',
  })
  @IsDateString()
  effectiveDate: string;

  @ApiPropertyOptional({
    description:
      'Username or identifier of the creator of this parameter value.',
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  createdBy?: string;
}
