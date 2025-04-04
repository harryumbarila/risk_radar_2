import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for reviewing risk radar exceptions
 */
export class ReviewExceptionInputDto {
  @ApiProperty({
    description: 'Comma-separated list of Risk Radar Exception IDs to review',
    example: '123,456,789',
  })
  @IsString()
  @IsNotEmpty()
  public reviewList: string;

  @ApiProperty({
    description: 'Username who is reviewing the exceptions',
    example: 'jsmith',
  })
  @IsString()
  @IsNotEmpty()
  public user: string;
} 