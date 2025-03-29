import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblRiskRadarExceptions_Jeff')
export class RiskRadarExceptionsJeff {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarExceptions' })
  public id: number;

  @Column({ name: 'fkRiskRadarExceptionStatus', type: 'int' })
  public exceptionStatusId: number;

  @Column({ name: 'fkRiskRadarUserAssigned', type: 'int', nullable: true })
  public userAssignedId: number | null;

  @Column({ name: 'sBankNum', type: 'varchar', length: 4, nullable: true })
  public bankNum: string | null;

  @Column({ name: 'dtFunding', type: 'datetime', nullable: true })
  public fundingDate: Date | null;

  @Column({
    name: 'sACHFundingTime',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  public achFundingTime: string | null;

  @Column({ name: 'dtTransmission', type: 'datetime', nullable: true })
  public transmissionDate: Date | null;

  @Column({ name: 'iTransmissionNum', type: 'int', nullable: true })
  public transmissionNum: number | null;

  @Column({
    name: 'dNetDepAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public netDepositAmount: number | null;

  @Column({ name: 'sMID', type: 'varchar', length: 16 })
  public merchantId: string;

  @Column({ name: 'sDBA', type: 'varchar', length: 100, nullable: true })
  public dba: string | null;

  @Column({ name: 'dtActivated', type: 'datetime', nullable: true })
  public activatedDate: Date | null;

  @Column({ name: 'sISA', type: 'varchar', length: 100, nullable: true })
  public isa: string | null;

  @Column({ name: 'bSelfGen', type: 'bit' })
  public isSelfGenerated: boolean;

  @Column({ name: 'iTransAmtAboveLimit', type: 'int', nullable: true })
  public transAmountAboveLimit: number | null;

  @Column({ name: 'iNumOfKeyedTransAboveLimit', type: 'int', nullable: true })
  public numOfKeyedTransAboveLimit: number | null;

  @Column({ name: 'bBatchVolAboveLimit', type: 'bit' })
  public isBatchVolAboveLimit: boolean;

  @Column({ name: 'iDupCard', type: 'int', nullable: true })
  public duplicateCard: number | null;

  @Column({ name: 'bNewAcct', type: 'bit' })
  public isNewAccount: boolean;

  @Column({ name: 'iDupBin', type: 'int', nullable: true })
  public duplicateBin: number | null;

  @Column({ name: 'iLatePostTrans', type: 'int', nullable: true })
  public latePostTrans: number | null;

  @Column({ name: 'iFgnkeyedTrans', type: 'int', nullable: true })
  public foreignKeyedTrans: number | null;

  @Column({ name: 'iNoAuthTrans', type: 'int', nullable: true })
  public noAuthTrans: number | null;

  @Column({ name: 'bChbkOrIRR', type: 'bit' })
  public hasChargebackOrIRR: boolean;

  @Column({ name: 'bHidden', type: 'bit' })
  public isHidden: boolean;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdDate: Date;

  @Column({ name: 'bAuthCaptureAmtLargeVariation', type: 'bit' })
  public hasAuthCaptureAmtLargeVariation: boolean;

  @Column({ name: 'bNextDayFundingAcct', type: 'bit', nullable: true })
  public isNextDayFundingAccount: boolean | null;

  @Column({ name: 'iMototIoAVS', type: 'int', nullable: true })
  public mototIoAVS: number | null;

  @Column({
    name: 'dSettlementBalance',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public settlementBalance: number | null;

  @Column({ name: 'bRiskWatch', type: 'bit' })
  public isRiskWatch: boolean;

  @Column({ name: 'iAvgBatch', type: 'int', nullable: true })
  public averageBatch: number | null;

  @Column({ name: 'iAuthDecline', type: 'int', nullable: true })
  public authDecline: number | null;

  @Column({ name: 'iNegDailyBatches', type: 'int', nullable: true })
  public negDailyBatches: number | null;

  @Column({ name: 'iBatchVolAboveLimit', type: 'int', nullable: true })
  public batchVolAboveLimit: number | null;

  @Column({ name: 'iChbkOrIRR', type: 'int', nullable: true })
  public chargebackOrIRR: number | null;

  @Column({
    name: 'iAuthCaptureAmtLargeVariation',
    type: 'int',
    nullable: true,
  })
  public authCaptureAmtLargeVariation: number | null;

  @Column({ name: 'bDivert', type: 'bit' })
  public isDivert: boolean;

  @Column({
    name: 'dAuthDeclineAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public authDeclineAmount: number | null;

  @Column({
    name: 'sUserReviewed',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public userReviewed: string | null;

  @Column({ name: 'iAutoHold', type: 'int', nullable: true })
  public autoHold: number | null;

  @Column({
    name: 'iTransAmtAboveHighTicketLimit',
    type: 'int',
    nullable: true,
  })
  public transAmtAboveHighTicketLimit: number | null;

  @Column({ name: 'iCreditRule', type: 'int', nullable: true })
  public creditRule: number | null;

  @Column({ name: 'iSalesChannelRule', type: 'int', nullable: true })
  public salesChannelRule: number | null;

  @Column({
    name: 'iFundingExclusionAndException',
    type: 'int',
    nullable: true,
  })
  public fundingExclusionAndException: number | null;

  @Column({
    name: 'dAuthNonDeclinedAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public authNonDeclinedAmount: number | null;

  @Column({ name: 'iAccountType', type: 'int', nullable: true })
  public accountType: number | null;
}
