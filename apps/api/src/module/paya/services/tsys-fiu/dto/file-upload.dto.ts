import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

import { TsysFiuFileVariantType } from '@/paya-db/enums';

export class TsysFiuFileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'The file to upload',
  })
  @IsString()
  public fileId: string;

  @ApiProperty({
    enum: TsysFiuFileVariantType,
    enumName: 'TsysFiuFileVariantType',
  })
  @IsEnum(TsysFiuFileVariantType)
  public variant: TsysFiuFileVariantType;

  @ApiProperty({
    type: 'string',
    description: 'The user name to submitted',
  })
  @IsString()
  public userName: string;

  @ApiProperty({
    type: 'string',
    description: 'The date modified file to submitted',
  })
  @IsString()
  public modifiedAt: string;

  @ApiProperty({
    type: 'string',
    description: 'The user IP address',
  })
  @IsString()
  public ip: string;
}
