import { IsString } from 'class-validator';

export class AssignExceptionReviewInputDto {
  @IsString()
  public reviewList: string;

  @IsString()
  public user: string;
}
