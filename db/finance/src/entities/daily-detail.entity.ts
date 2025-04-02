import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'dbo.dailydetail' })
export class DailyDetail {
  @PrimaryGeneratedColumn({ name: 'transnum' })
  public transactionId: number;

  @Column({ name: 'batchnum', length: 10, nullable: true })
  public batchNumber: string | null;

  @Column({ name: 'julint', nullable: true })
  public julianDate: number | null;

  @Column({ name: 'batchjulian', length: 5, nullable: true })
  public batchJulian: string | null;

  @Column({ name: 'intmid' })
  public merchantId: number;

  @Column({ name: 'mid', length: 16, nullable: true })
  public mid: string | null;

  @Column({ name: 'dba', length: 25, nullable: true })
  public dba: string | null;

  @Column({ name: 'sic', length: 4, nullable: true })
  public sicCode: string | null;

  @Column({ name: 'termnum', length: 4, nullable: true })
  public terminalNumber: string | null;

  @Column({ name: 'refnum', length: 23, nullable: true })
  public referenceNumber: string | null;

  @Column({ name: 'transdate', type: 'datetime', nullable: true })
  public transactionDate: Date | null;

  @Column({ name: 'transamount', type: 'float', nullable: true })
  public transactionAmount: number | null;

  @Column({ name: 'settledate', type: 'datetime', nullable: true })
  public settlementDate: Date | null;

  @Column({ name: 'settleamt', type: 'float', nullable: true })
  public settlementAmount: number | null;

  @Column({ name: 'cardnum', length: 22, nullable: true })
  public cardNumber: string | null;

  @Column({ name: 'extpan', length: 28, nullable: true })
  public extendedPan: string | null;

  @Column({ name: 'cardexpdate', length: 4, nullable: true })
  public cardExpirationDate: string | null;

  @Column({ name: 'cardiomethod', length: 1, nullable: true })
  public cardIoMethod: string | null;

  @Column({ name: 'motoind', length: 1, nullable: true })
  public motoIndicator: string | null;

  @Column({ name: 'transactionid', length: 15, nullable: true })
  public transactionIdentifier: string | null;

  @Column({ name: 'authamt', type: 'float', nullable: true })
  public authorizationAmount: number | null;

  @Column({ name: 'cardtype', length: 2, nullable: true })
  public cardType: string | null;

  @Column({ name: 'authnum', length: 6, nullable: true })
  public authorizationNumber: string | null;

  @Column({ name: 'origtransamt', type: 'float', nullable: true })
  public originalTransactionAmount: number | null;

  @Column({ name: 'creditdebitind', length: 1, nullable: true })
  public creditDebitIndicator: string | null;

  @Column({ name: 'achhold', length: 1, nullable: true })
  public achHold: string | null;

  @Column({ name: 'authsource', length: 1, nullable: true })
  public authorizationSource: string | null;

  @Column({ name: 'processingcode', length: 6, nullable: true })
  public processingCode: string | null;

  @Column({ name: 'approvalcode', length: 6, nullable: true })
  public approvalCode: string | null;

  @Column({ name: 'rejectcode', length: 4, nullable: true })
  public rejectionCode: string | null;

  @Column({ name: 'cvvindicator', length: 1, nullable: true })
  public cvvIndicator: string | null;

  @Column({ name: 'poscode', length: 2, nullable: true })
  public posCode: string | null;

  @Column({ name: 'market', length: 1, nullable: true })
  public marketIndicator: string | null;

  @Column({ name: 'cashbackamt', type: 'float', nullable: true })
  public cashbackAmount: number | null;

  @Column({ name: 'debittransfee', type: 'float', nullable: true })
  public debitTransactionFee: number | null;

  @Column({
    name: 'cardnum_encrypted',
    type: 'varbinary',
    length: 50,
    nullable: true,
  })
  public encryptedCardNumber: Buffer | null;

  @Column({ name: 'msgtype', length: 4, nullable: true })
  public messageType: string | null;

  @Column({ name: 'cardnum_truncated', length: 22, nullable: true })
  public truncatedCardNumber: string | null;

  @Column({ name: 'posmode', length: 4, nullable: true })
  public posMode: string | null;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdAt: Date;

  @Column({ name: 'networkid', length: 4, nullable: true })
  public networkId: string | null;

  @Column({ name: 'dialpayauth', length: 2, nullable: true })
  public dialPayAuth: string | null;

  @Column({ name: 'agent', length: 6, nullable: true })
  public agent: string | null;

  @Column({ name: 'chain', length: 6, nullable: true })
  public chain: string | null;

  @Column({ name: 'acqbin', length: 6, nullable: true })
  public acquirerBin: string | null;

  @Column({
    name: 'filecreatedbyprocessordatetime',
    length: 14,
    nullable: true,
  })
  public fileCreatedByProcessorDateTime: string | null;

  @Column({ name: 'authrespcode', length: 2, nullable: true })
  public authResponseCode: string | null;

  @Column({ name: 'msgreasoncode', length: 4, nullable: true })
  public messageReasonCode: string | null;

  @Column({
    name: 'replamt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public replacementAmount: number | null;

  @Column({ name: 'accessmethod', length: 2, nullable: true })
  public accessMethod: string | null;

  @Column({ name: 'fallback_indicator', length: 1, nullable: true })
  public fallbackIndicator: string | null;

  @Column({ name: 'accountid', length: 28, nullable: true })
  public accountId: string | null;

  @Column({ name: 'validation_code', length: 4, nullable: true })
  public validationCode: string | null;

  @Column({ name: 'AddlPOSInfoText', length: 12, nullable: true })
  public additionalPosInfoText: string | null;

  @Column({ name: 'iGT2AuthDeclOnDiffCardPoints', nullable: true })
  public gt2AuthDeclOnDiffCardPoints: number | null;

  @Column({ name: 'iGT1AuthDeclOnSameCardPoints', nullable: true })
  public gt1AuthDeclOnSameCardPoints: number | null;

  @Column({ name: 'i1AuthDeclOnSpecificReasonPoints', nullable: true })
  public i1AuthDeclOnSpecificReasonPoints: number | null;

  @Column({ name: 'POSDataCode', length: 12, nullable: true })
  public posDataCode: string | null;

  @Column({ name: 'POSEnvInd', length: 1, nullable: true })
  public posEnvironmentIndicator: string | null;

  @Column({ name: 'LocalTransDate', length: 4, nullable: true })
  public localTransactionDate: string | null;

  @Column({ name: 'LocalTransTime', length: 6, nullable: true })
  public localTransactionTime: string | null;

  @Column({ name: 'var_track_id', length: 10, nullable: true })
  public variableTrackId: string | null;

  @Column({ name: 'AVSResultCode', length: 1, nullable: true })
  public avsResultCode: string | null;

  @Column({ name: 'CVVResultCode', length: 1, nullable: true })
  public cvvResultCode: string | null;

  @Column({ name: 'iAuthVoids', nullable: true })
  public authorizationVoids: number | null;
}
