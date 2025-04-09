import { IsNumber, IsString } from 'class-validator';

export class PushNoteToIrisInputDto {
  @IsNumber()
  public noteId: number;

  @IsString()
  public merchantId: string;
}
