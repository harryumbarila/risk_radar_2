import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tblRiskRadarTransaction', { schema: 'Finance.dbo' })
export class RiskRadarTransaction {
  @PrimaryColumn({ name: 'pkDFT256Transaction', type: 'int' })
  public transactionId: number;

  @Column({ name: 'fkDFT256Batch', type: 'int', nullable: true })
  public batchId?: number;

  @Column({ name: 'iTransSeqNum', type: 'int', nullable: true })
  public transactionSequenceNumber?: number;

  @Column({
    name: 'sAcqInternalRefNum',
    type: 'varchar',
    length: 11,
    nullable: true,
  })
  public acquirerInternalReferenceNumber?: string;

  @Column({ name: 'dtTrans', type: 'datetime', nullable: true })
  public transactionDate?: Date;

  @Column({
    name: 'dTransAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public transactionAmount?: number;

  @Column({ name: 'sCardNumF6', type: 'varchar', length: 6, nullable: true })
  public cardFirstSixDigits?: string;

  @Column({ name: 'sCardNumL4', type: 'varchar', length: 4, nullable: true })
  public cardLastFourDigits?: string;

  @Column({ name: 'sAuthCode', type: 'varchar', length: 6, nullable: true })
  public authorizationCode?: string;

  @Column({
    name: 'sDebitNetworkIdentifier',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  public debitNetworkIdentifier?: string;

  @Column({ name: 'sPOSEntryMode', type: 'varchar', length: 2, nullable: true })
  public posEntryMode?: string;

  @Column({ name: 'sAVSRespCode', type: 'varchar', length: 1, nullable: true })
  public avsResponseCode?: string;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdDate: Date;

  @Column({ name: 'sTransID', type: 'varchar', length: 15, nullable: true })
  public transactionIdentifier?: string;

  @Column({
    name: 'dAuthAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public authorizationAmount?: number;

  @Column({ name: 'iATPoints', type: 'int', nullable: true })
  public atPoints?: number;

  @Column({ name: 'iDuplCardPoints', type: 'int', nullable: true })
  public duplicateCardPoints?: number;

  @Column({ name: 'iDuplBINPoints', type: 'int', nullable: true })
  public duplicateBinPoints?: number;

  @Column({ name: 'iLatePostTransPoints', type: 'int', nullable: true })
  public latePostedTransactionPoints?: number;

  @Column({ name: 'iFgnkeyedTransPoints', type: 'int', nullable: true })
  public foreignKeyedTransactionPoints?: number;

  @Column({ name: 'iNoAuthTransPoints', type: 'int', nullable: true })
  public noAuthorizationTransactionPoints?: number;

  @Column({
    name: 'iAuthCaptureAmtLargeVariationPoints',
    type: 'int',
    nullable: true,
  })
  public authCaptureAmountLargeVariationPoints?: number;

  @Column({ name: 'iMotoIoAVSPoints', type: 'int', nullable: true })
  public motoIoAvsPoints?: number;

  @Column({ name: 'sCardExp', type: 'varchar', length: 4, nullable: true })
  public cardExpiration?: string;

  @Column({
    name: 'sEXPOSEntryMode',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  public exposeEntryMode?: string;

  @Column({
    name: 'sDIAVSResponseCode',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  public diaAvsResponseCode?: string;

  @Column({ name: 'iHTPoints', type: 'int', nullable: true })
  public htPoints?: number;

  @Column({ name: 'iCreditTransPoint', type: 'int', nullable: true })
  public creditTransactionPoints?: number;

  @Column({ name: 'iSalesChannelRulePoints', type: 'int', nullable: true })
  public salesChannelRulePoints?: number;

  @Column({ name: 'dtCreated_getdate', type: 'datetime', nullable: true })
  public createdDateGetDate?: Date;
}
