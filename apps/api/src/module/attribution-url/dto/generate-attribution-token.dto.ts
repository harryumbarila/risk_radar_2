import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenerateAttributionTokenDto {
  @ApiProperty({
    description: 'User ID for attribution',
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Channel ID for attribution',
    example: '67890',
  })
  @IsString()
  @IsNotEmpty()
  channel_id: string;

  @ApiProperty({
    description: 'Public key for attribution',
    example: 'pb_test_...',
  })
  @IsString()
  @IsNotEmpty()
  pb_key: string;

  @ApiPropertyOptional({
    description: 'RSL user ID for attribution',
    example: '11111',
    required: false,
  })
  @IsString()
  @IsOptional()
  rsl_user_id?: string;

  @ApiPropertyOptional({
    description: 'Referral partner user ID for attribution',
    example: '22222',
    required: false,
  })
  @IsString()
  @IsOptional()
  referral_partner_user_id?: string;

  @ApiPropertyOptional({
    description: 'Source ID for attribution',
    example: '33333',
    required: false,
  })
  @IsString()
  @IsOptional()
  source_id?: string;

  @ApiPropertyOptional({
    description: 'Lead ID for attribution',
    example: '44444',
    required: false,
  })
  @IsString()
  @IsOptional()
  lead_id?: string;
}

export class GenerateAttributionTokenResponseDto {
  @ApiProperty({
    description: 'JWT token for attribution URL',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;
}
