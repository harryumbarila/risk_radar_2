import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetTsysFiuFileDownloadDto {
  @ApiProperty({
    type: 'string',
    description: 'The file id to download',
  })
  @IsString()
  public id: string;

  @ApiProperty({
    type: 'string',
    description: 'Downloader user name',
  })
  @IsString()
  public userName: string;

  @ApiProperty({
    type: 'string',
    description: 'The user IP address',
  })
  @IsString()
  public ip: string;
}
