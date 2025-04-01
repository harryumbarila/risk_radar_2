import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'dbo.dailydetail' })
export class DailyDetail {
  @PrimaryGeneratedColumn()
  public transactionId: number;

  @Column({ length: 10, nullable: true })
  public batchNumber: string;

  @Column({ nullable: true })
  public julianDate: number;

  @Column({ length: 5, nullable: true })
  public batchJulian: string;

  @Column()
  public merchantId: number;

  @Column({ length: 16, nullable: true })
  public mid: string;

  @Column({ length: 25, nullable: true })
  public dba: string;

  @Column({ length: 4, nullable: true })
  public sicCode: string;

  @Column({ length: 4, nullable: true })
  public terminalNumber: string;

  @Column({ length: 23, nullable: true })
  public referenceNumber: string;

  @Column({ type: 'datetime', nullable: true })
  public transactionDate: Date;

  @Column({ type: 'float', nullable: true })
  public transactionAmount: number;

  @Column({ type: 'datetime', nullable: true })
  public settlementDate: Date;

  @Column({ type: 'float', nullable: true })
  public settlementAmount: number;

  @Column({ length: 22, nullable: true })
  public cardNumber: string;

  @Column({ length: 28, nullable: true })
  public extendedPan: string;

  @Column({ length: 4, nullable: true })
  public cardExpirationDate: string;

  @Column({ length: 1, nullable: true })
  public cardIoMethod: string;

  @Column({ length: 1, nullable: true })
  public motoIndicator: string;

  @Column({ length: 15, nullable: true })
  public transactionIdentifier: string;

  @Column({ type: 'float', nullable: true })
  public authorizationAmount: number;

  @Column({ length: 2, nullable: true })
  public cardType: string;

  @Column({ length: 6, nullable: true })
  public authorizationNumber: string;

  @Column({ type: 'float', nullable: true })
  public originalTransactionAmount: number;

  @Column({ length: 1, nullable: true })
  public creditDebitIndicator: string;

  @Column({ length: 1, nullable: true })
  public achHold: string;

  @Column({ length: 1, nullable: true })
  public authorizationSource: string;

  @Column({ length: 6, nullable: true })
  public processingCode: string;

  @Column({ length: 6, nullable: true })
  public approvalCode: string;

  @Column({ length: 4, nullable: true })
  public rejectionCode: string;

  @Column({ length: 1, nullable: true })
  public cvvIndicator: string;

  @Column({ length: 2, nullable: true })
  public posCode: string;

  @Column({ length: 1, nullable: true })
  public marketIndicator: string;

  @Column({ type: 'float', nullable: true })
  public cashbackAmount: number;

  @Column({ type: 'float', nullable: true })
  public debitTransactionFee: number;

  @Column({ type: 'varbinary', length: 50, nullable: true })
  public encryptedCardNumber: Buffer;

  @Column({ length: 4, nullable: true })
  public messageType: string;

  @Column({ length: 22, nullable: true })
  public truncatedCardNumber: string;

  @Column({ length: 4, nullable: true })
  public posMode: string;

  @Column({ type: 'datetime' })
  public createdAt: Date;

  @Column({ name: 'iGT2AuthDeclOnDiffCardPoints', nullable: true })
  public gt2AuthDeclOnDiffCardPoints?: number;

  @Column({ name: 'iGT1AuthDeclOnSameCardPoints', nullable: true })
  public gt1AuthDeclOnSameCardPoints?: number;

  @Column({ name: 'i1AuthDeclOnSpecificReasonPoints', nullable: true })
  public i1AuthDeclOnSpecificReasonPoints?: number;
}
