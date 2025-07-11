import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendExceptionMemoEmailDto {
  @IsNotEmpty()
  @IsNumber()
  public mid: number;

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

  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
