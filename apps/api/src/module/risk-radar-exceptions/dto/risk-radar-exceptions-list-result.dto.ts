import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class RiskRadarExceptionsListResultDto {
  @IsInt()
  public pkRiskRadarExceptions: number;

  @IsOptional()
  @IsNumber()
  public dNetDepAmt?: number | null;

  @IsOptional()
  @IsString()
  public sDBA?: string | null;

  @IsOptional()
  @IsString()
  public sSolutionConsultant?: string | null;

  @IsOptional()
  @IsString()
  public bSelfGen?: string | null;

  @IsOptional()
  @IsInt()
  public iTransAmtAboveLimit?: number | null;

  @IsOptional()
  @IsInt()
  public iNumOfKeyedTransAboveLimit?: number | null;

  @IsOptional()
  @IsInt()
  public iBatchVolAboveLimit?: number | null;

  @IsOptional()
  @IsInt()
  public iDupCard?: number | null;

  @IsOptional()
  @IsString()
  public bNewAcct?: string | null;

  @IsOptional()
  @IsInt()
  public iDupBin?: number | null;

  @IsOptional()
  @IsInt()
  public iLatePostTrans?: number | null;

  @IsOptional()
  @IsInt()
  public iFgnkeyedTrans?: number | null;

  @IsOptional()
  @IsInt()
  public iNoAuthTrans?: number | null;

  @IsOptional()
  @IsInt()
  public iChbkOrIRR?: number | null;

  @IsOptional()
  @IsString()
  public bNextDayFundingAcct?: string | null;

  @IsString()
  public sMID: string;

  @IsOptional()
  @IsString()
  public sNTUserID?: string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public dtTransmission?: Date | null;

  @IsOptional()
  @IsString()
  public bDivert?: string | null;

  @IsOptional()
  @IsString()
  public sAMEXOptBlueInd?: string | null;

  @IsOptional()
  @IsInt()
  public iAuthCaptureAmtLargeVariation?: number | null;

  @IsOptional()
  @IsString()
  public bRiskWatch?: string | null;

  @IsOptional()
  @IsNumber()
  public dSettlementBalance?: number | null;

  @IsOptional()
  @IsInt()
  public iAvgBatch?: number | null;

  @IsOptional()
  @IsInt()
  public iNegDailyBatches?: number | null;

  @IsOptional()
  @IsInt()
  public iMototIoAVS?: number | null;

  @IsOptional()
  @IsInt()
  public iAuthDecline?: number | null;

  @IsOptional()
  @IsInt()
  public iTotalPoints?: number | null;

  @IsNumber()
  public dAuthDeclineAmt: number;

  @IsOptional()
  @IsString()
  public sUserReviewed?: string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public dtActivated?: Date | null;

  @Type(() => Date)
  @IsDate()
  public dtCreated: Date;

  @IsString()
  public sChannel: string;

  @IsOptional()
  @IsInt()
  public iAutoHold?: number | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public dtAutoApproved?: Date | null;

  @IsOptional()
  @IsInt()
  public iTransAmtAboveHighTicketLimit?: number | null;

  @IsOptional()
  @IsInt()
  public iCreditRule?: number | null;

  @IsOptional()
  @IsInt()
  public iSalesChannelRule?: number | null;

  @IsOptional()
  @IsInt()
  public iFundingExclusionAndException?: number | null;

  @IsNumber()
  public dAuthNonDeclinedAmt: number;

  @IsString()
  public sReseller: string;

  @IsString()
  public sReferralPartner: string;

  @IsString()
  public sISV: string;
}
