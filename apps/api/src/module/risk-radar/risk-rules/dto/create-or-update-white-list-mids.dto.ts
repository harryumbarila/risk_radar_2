import { IsBoolean, IsDate, IsString, Length } from "class-validator";

export class CreateOrUpdateWhiteListMidDto {
  @IsString()
  @Length(1, 16)
  public mid: string;

  @IsBoolean()
  public AH01: boolean;
  @IsBoolean()
  public AH02: boolean;
  @IsBoolean()
  public AH03: boolean;
  @IsBoolean()
  public AH04: boolean;
  @IsBoolean()
  public AH05: boolean;
  @IsBoolean()
  public AH06: boolean;
  @IsBoolean()
  public AH07: boolean;
  @IsBoolean()
  public AH08: boolean;
  @IsBoolean()
  public AH09: boolean;
  @IsBoolean()
  public AH10: boolean;
  @IsBoolean()
  public AH11: boolean;
  @IsBoolean()
  public AH12: boolean;
  @IsBoolean()
  public AH13: boolean;
  @IsBoolean()
  public AH14: boolean;
  @IsBoolean()
  public AH15: boolean;
  @IsBoolean()
  public AH16: boolean;
  @IsString()
  @Length(1, 25)
  public lastUpdatedBy: string;
}

