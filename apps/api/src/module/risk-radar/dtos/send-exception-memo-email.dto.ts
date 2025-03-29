import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendExceptionMemoEmailDto {
  @IsNotEmpty()
  @IsString()
  public mid: string;

  @IsNotEmpty()
  @IsString()
  public emailBody: string;

  @IsNotEmpty()
  @IsNumber()
  public emailTemplateId: number;

  @IsNotEmpty()
  @IsString()
  public emailRecipient: string;

  @IsNotEmpty()
  @IsString()
  public user: string;
}
