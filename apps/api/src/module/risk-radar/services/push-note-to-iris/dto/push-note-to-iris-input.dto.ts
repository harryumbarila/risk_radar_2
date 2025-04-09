import { IsString } from 'class-validator';

export class PushNoteToIrisInputDto {
  @IsString()
  public note: string;

  @IsString()
  public merchantId: string;
}
