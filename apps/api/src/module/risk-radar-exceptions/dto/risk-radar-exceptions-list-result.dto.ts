import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class RiskRadarExceptionsListResultDto {
  @IsInt()
  public pkRiskRadarExceptions: number;

  @IsOptional()
  @IsNumber()
  public dNetDepAmt?: number;

  @IsOptional()
  @IsString()
  public sDBA?: string;

  @IsOptional()
  @IsString()
  public sSolutionConsultant?: string;

  @IsOptional()
  @IsString()
  public bSelfGen?: string;

  @IsOptional()
  @IsInt()
  public iTransAmtAboveLimit?: number;

  @IsOptional()
  @IsInt()
  public iNumOfKeyedTransAboveLimit?: number;

  @IsOptional()
  @IsInt()
  public iBatchVolAboveLimit?: number;

  @IsOptional()
  @IsInt()
  public iDupCard?: number;

  @IsOptional()
  @IsString()
  public bNewAcct?: string;

  @IsOptional()
  @IsInt()
  public iDupBin?: number;

  @IsOptional()
  @IsInt()
  public iLatePostTrans?: number;

  @IsOptional()
  @IsInt()
  public iFgnkeyedTrans?: number;

  @IsOptional()
  @IsInt()
  public iNoAuthTrans?: number;

  @IsOptional()
  @IsInt()
  public iChbkOrIRR?: number;

  @IsOptional()
  @IsString()
  public bNextDayFundingAcct?: string;

  @IsString()
  public sMID: string;

  @IsOptional()
  @IsString()
  public sNTUserID?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public dtTransmission?: Date;

  @IsOptional()
  @IsString()
  public bDivert?: string;

  @IsOptional()
  @IsString()
  public sAMEXOptBlueInd?: string;

  @IsOptional()
  @IsInt()
  public iAuthCaptureAmtLargeVariation?: number;

  @IsOptional()
  @IsString()
  public bRiskWatch?: string;

  @IsOptional()
  @IsNumber()
  public dSettlementBalance?: number;

  @IsOptional()
  @IsInt()
  public iAvgBatch?: number;

  @IsOptional()
  @IsInt()
  public iNegDailyBatches?: number;

  @IsOptional()
  @IsInt()
  public iMototIoAVS?: number;

  @IsOptional()
  @IsInt()
  public iAuthDecline?: number;

  @IsOptional()
  @IsInt()
  public iTotalPoints?: number;

  @IsNumber()
  public dAuthDeclineAmt: number;

  @IsOptional()
  @IsString()
  public sUserReviewed?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public dtActivated?: Date;

  @Type(() => Date)
  @IsDate()
  public dtCreated: Date;

  @IsString()
  public sChannel: string;

  @IsOptional()
  @IsInt()
  public iAutoHold?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  public dtAutoApproved?: Date;

  @IsOptional()
  @IsInt()
  public iTransAmtAboveHighTicketLimit?: number;

  @IsOptional()
  @IsInt()
  public iCreditRule?: number;

  @IsOptional()
  @IsInt()
  public iSalesChannelRule?: number;

  @IsOptional()
  @IsInt()
  public iFundingExclusionAndException?: number;

  @IsNumber()
  public dAuthNonDeclinedAmt: number;

  @IsString()
  public sReseller: string;

  @IsString()
  public sReferralPartner: string;

  @IsString()
  public sISV: string;
}
