import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

/**
 * DTO for assigning risk radar exceptions to a specific user
 */
export class AssignExceptionsDto {
  @ApiProperty({
    description: 'Comma-separated list of Risk Radar Exception IDs to assign',
    example: '123,456,789',
  })
  @IsString()
  @IsNotEmpty()
  public exceptionIds: string;

  @ApiProperty({
    description: 'ID of the Risk Radar User to assign the exceptions to',
    example: 42,
  })
  @IsNumber()
  public assignToUserId: number;

  @ApiProperty({
    description: 'Username of the person making the assignment',
    example: 'jsmith',
  })
  @IsString()
  @IsNotEmpty()
  public createdBy: string;
}

/**
 * Response DTO for the assign exceptions operation
 */
export class AssignExceptionsResponseDto {
  @ApiProperty({
    description: 'Indicates if the assignment was successful',
    example: true,
  })
  public success: boolean;
}
