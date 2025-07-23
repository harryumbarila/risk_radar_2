import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class HandleDiverRemovedDto {
  @ApiProperty({
    description: 'Merchant ID (MID)',
    example: '561100001234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(12, 20, { message: 'MID must be between 12 and 20 characters' })
  public mid: string;

  @ApiProperty({
    description: 'Username of the user performing the action',
    example: 'admin.user',
  })
  @IsString()
  @IsNotEmpty()
  public user: string;
}
