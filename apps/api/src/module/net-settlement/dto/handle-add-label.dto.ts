import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NetSettlementMidLabelUpdateDto {
  @ApiProperty({
    description: 'Merchant ID (MID)',
    example: '561100001234',
  })
  @IsString()
  @IsNotEmpty()
  public mid: string;

  @ApiProperty({
    description: 'Label type id',
    example: '1',
    required: true,
  })
  @IsNumber()
  public netSettlementLabelTypeId: number;

  @ApiProperty({
    description: 'Username of the user performing the action',
    example: 'admin.user',
  })
  @IsString()
  @IsNotEmpty()
  public user: string;
}
