import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortColumn {
  DBA = 'sDBA',
  NET_DEPOSIT = 'dNetDepAmt',
  FSP_APPROVED_AUTH = 'dAuthNonDeclinedAmt',
  AUTH_DECLINE = 'dAuthDeclineAmt',
  ACTIVATION_DATE = 'dtActivated',
  CHANNEL = 'sChannel',
  RESELLER = 'sReseller',
  REFERRAL_PARTNER = 'sReferralPartner',
  SOLUTION_CONSULTANT = 'sSolutionConsultant',
  AUTO_APPROVED = 'dtAutoApproved',
  RISK_WATCH = 'bRiskWatch',
  NEW_ACCOUNT = 'bNewAcct',
  KEYED_PERCENTAGE = 'iNumOfKeyedTransAboveLimit',
  AVG_TICKET = 'iTransAmtAboveLimit',
  HIGH_TICKET = 'iTransAmtAboveHighTicketLimit',
  CREDIT_RULE = 'iCreditRule',
  SALES_CHANNEL_RULE = 'iSalesChannelRule',
  MONTHLY_VOLUME = 'iBatchVolAboveLimit',
  AVG_BATCH = 'iAvgBatch',
  DUP_CARD = 'iDupCard',
  DUP_BIN = 'iDupBin',
  LATE_POST = 'iLatePostTrans',
  FOREIGN_KEYED = 'iFgnkeyedTrans',
  CHARGEBACK = 'iChbkOrIRR',
  NEXT_DAY_FUNDING = 'bNextDayFundingAcct',
  DIVERT = 'bDivert',
  NET_DIVERT_BALANCE = 'dSettlementBalance',
  AMEX_OPT_BLUE = 'sAMEXOptBlueInd',
  MOTO_AVS = 'iMototIoAVS',
  SETTLE_30_PLUS = 'iAuthCaptureAmtLargeVariation',
  NO_AUTH = 'iNoAuthTrans',
  AUTH_DECLINE_SCORE = 'iAuthDecline',
  NEGATIVE_BATCH = 'iNegDailyBatches',
  AUTO_HOLD = 'iAutoHold',
  FUNDING_EXCEPTION = 'iFundingExclusionAndException',
  TOTAL_POINTS = 'iTotalPoints',
  CREATED_DATE = 'dtCreated',
  MERCHANT_ID = 'sMID',
  TRANSMISSION_DATE = 'dtTransmission',
}

export class ExceptionListInputDto {
  // Dates & system
  @Type(() => Date)
  @IsDate()
  public startDate: Date;

  @Type(() => Date)
  @IsDate()
  public endDate: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  public processor?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  public viewAllExceptions?: boolean;

  // Exception type
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(
    ({ value }) =>
      Array.isArray(value) ? (value as string[]) : [String(value)] // Always array even if just 1 value passed
  )
  public categories: string[] = [];

  // Exception status | Assigned to user | MID | DBA/SIC
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  public status?: number;

  @IsOptional()
  @IsString()
  @Length(1, 16)
  public merchantId?: string;

  @IsOptional()
  @IsString()
  public assignedToUser?: string;

  @IsOptional()
  @IsString()
  public dbaNameOrSIC?: string;

  // Pagination
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public pageSize?: number = 25;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public page?: number = 1;

  // Sorting
  @IsOptional()
  @IsEnum(SortColumn)
  public sortBy?: SortColumn;

  @IsOptional()
  @IsEnum(SortDirection)
  public sortDirection?: SortDirection = SortDirection.DESC;
}
