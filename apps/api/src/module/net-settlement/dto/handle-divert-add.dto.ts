import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class HandleDiverAddDto {
  @ApiProperty({
    description: 'Merchant ID (MID)',
    example: '561100001234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(12, 20, { message: 'MID must be between 12 and 20 characters' })
  public mid: string;

  @ApiProperty({
    description: 'Notes about the divert action',
    example: 'Manual put on divert via NetSettlement',
    required: true,
  })
  @IsString()
  @IsOptional()
  public note: string;

  @ApiProperty({
    description: 'Username of the user performing the action',
    example: 'admin.user',
  })
  @IsString()
  @IsNotEmpty()
  public user: string;
}
