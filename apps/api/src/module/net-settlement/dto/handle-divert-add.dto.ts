import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class HandleDiverAddDto {
  @ApiProperty({
    description: 'Merchant ID (MID)',
    example: '561100001234',
  })
  @IsString()
  @IsNotEmpty()
  public mid: string;

  @ApiPropertyOptional({
    description: 'Notes about the divert action',
    example: 'Manual put on divert via NetSettlement',
    required: false,
  })
  @IsString()
  @IsOptional()
  public note?: string;

  @ApiProperty({
    description: 'Username of the user performing the action',
    example: 'admin.user',
  })
  @IsString()
  @IsNotEmpty()
  public user: string;
}
