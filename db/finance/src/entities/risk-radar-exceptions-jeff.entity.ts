import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblRiskRadarExceptions_Jeff')
export class RiskRadarExceptionsJeffEntity {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarExceptions' })
  public id: number;

  @Column({
    name: 'fkRiskRadarExceptionStatus',
    type: 'int',
    nullable: false,
    default: 1,
  })
  public exceptionStatusId: number;

  @Column({ name: 'fkRiskRadarUserAssigned', type: 'int', nullable: true })
  public assignedUserId: number;

  @Column({ name: 'sBankNum', type: 'varchar', length: 4, nullable: true })
  public bankNumber: string;

  @Column({ name: 'dtFunding', type: 'datetime', nullable: true })
  public fundingDate: Date;

  @Column({
    name: 'sACHFundingTime',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  public achFundingTime: string;

  @Column({ name: 'dtTransmission', type: 'datetime', nullable: true })
  public transmissionDate: Date;

  @Column({ name: 'iTransmissionNum', type: 'int', nullable: true })
  public transmissionNumber: number;

  @Column({
    name: 'dNetDepAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public netDepositAmount: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: false })
  public mid: string;

  @Column({ name: 'sDBA', type: 'varchar', length: 100, nullable: true })
  public dba: string;

  @Column({ name: 'dtActivated', type: 'datetime', nullable: true })
  public activatedDate: Date;

  @Column({ name: 'sISA', type: 'varchar', length: 100, nullable: true })
  public isa: string;

  @Column({ name: 'bSelfGen', type: 'bit', nullable: false, default: false })
  public isSelfGenerated: boolean;

  @Column({ name: 'iTransAmtAboveLimit', type: 'int', nullable: true })
  public transactionsAboveLimit: number;

  @Column({ name: 'iNumOfKeyedTransAboveLimit', type: 'int', nullable: true })
  public numberOfKeyedTransactionsAboveLimit: number;

  @Column({
    name: 'bBatchVolAboveLimit',
    type: 'bit',
    nullable: false,
    default: false,
  })
  public isBatchVolumeAboveLimit: boolean;

  @Column({ name: 'iDupCard', type: 'int', nullable: true })
  public duplicateCards: number;

  @Column({ name: 'bNewAcct', type: 'bit', nullable: false, default: false })
  public isNewAccount: boolean;

  @Column({ name: 'iDupBin', type: 'int', nullable: true })
  public duplicateBins: number;

  @Column({ name: 'iLatePostTrans', type: 'int', nullable: true })
  public latePostTransactions: number;

  @Column({ name: 'iFgnkeyedTrans', type: 'int', nullable: true })
  public foreignKeyedTransactions: number;

  @Column({ name: 'iNoAuthTrans', type: 'int', nullable: true })
  public unauthorizedTransactions: number;

  @Column({ name: 'bChbkOrIRR', type: 'bit', nullable: false, default: false })
  public isChargebackOrIRR: boolean;

  @Column({ name: 'bHidden', type: 'bit', nullable: false, default: false })
  public isHidden: boolean;

  @Column({
    name: 'dtCreated',
    type: 'datetime',
    nullable: false,
    default: () => 'GETDATE()',
  })
  public createdAt: Date;

  @Column({
    name: 'bAuthCaptureAmtLargeVariation',
    type: 'bit',
    nullable: false,
    default: false,
  })
  public isAuthCaptureAmountLargeVariation: boolean;

  @Column({ name: 'bNextDayFundingAcct', type: 'bit', nullable: true })
  public isNextDayFundingAccount: boolean;

  @Column({ name: 'iMototIoAVS', type: 'int', nullable: true })
  public motoToIoAVS: number;

  @Column({
    name: 'dSettlementBalance',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public settlementBalance: number;

  @Column({ name: 'bRiskWatch', type: 'bit', nullable: false, default: false })
  public isRiskWatch: boolean;

  @Column({ name: 'iAvgBatch', type: 'int', nullable: true })
  public averageBatch: number;

  @Column({ name: 'iAuthDecline', type: 'int', nullable: true })
  public authDeclines: number;

  @Column({ name: 'iNegDailyBatches', type: 'int', nullable: true })
  public negativeDailyBatches: number;

  @Column({ name: 'iBatchVolAboveLimit', type: 'int', nullable: true })
  public batchVolumeAboveLimit: number;

  @Column({ name: 'iChbkOrIRR', type: 'int', nullable: true })
  public chargebackOrIRR: number;

  @Column({
    name: 'iAuthCaptureAmtLargeVariation',
    type: 'int',
    nullable: true,
  })
  public authCaptureAmountLargeVariation: number;

  @Column({ name: 'bDivert', type: 'bit', nullable: false, default: false })
  public isDiverted: boolean;

  @Column({
    name: 'dAuthDeclineAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public authDeclineAmount: number;

  @Column({
    name: 'sUserReviewed',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public userReviewed?: string | null;

  @Column({ name: 'iAutoHold', type: 'int', nullable: true })
  public autoHold: number;

  @Column({
    name: 'iTransAmtAboveHighTicketLimit',
    type: 'int',
    nullable: true,
  })
  public transactionsAboveHighTicketLimit: number;

  @Column({ name: 'iCreditRule', type: 'int', nullable: true })
  public creditRule: number;

  @Column({ name: 'iSalesChannelRule', type: 'int', nullable: true })
  public salesChannelRule: number;

  @Column({
    name: 'iFundingExclusionAndException',
    type: 'int',
    nullable: true,
  })
  public fundingExclusionAndException: number;

  @Column({
    name: 'dAuthNonDeclinedAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public authNonDeclinedAmount: number;

  @Column({ name: 'iAccountType', type: 'int', nullable: true })
  public accountType: number;

  @Column({ name: 'iTotalPoints', type: 'int', nullable: true })
  public totalPoints: number;
}
