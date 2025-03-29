import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ChargebackDataPull', { schema: 'DataWarehouse.AccessOne' })
export class ChargebackDataPullEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Column({ name: 'RecordID', type: 'bigint', nullable: true })
  public recordId: number | null;

  @Column({ name: 'ReportDate', type: 'datetimeoffset', nullable: true })
  public reportDate: Date | null;

  @Column({ name: 'TransactionDate', type: 'datetimeoffset', nullable: true })
  public transactionDate: Date | null;

  @Column({ name: 'CardType', type: 'varchar', length: 5, nullable: true })
  public cardType: string | null;

  @Column({ name: 'CardTypeDescription', type: 'varchar', length: 50, nullable: true })
  public cardTypeDescription: string | null;

  @Column({ name: 'CardNumber', type: 'varchar', length: 20, nullable: true })
  public cardNumber: string | null;

  @Column({ name: 'ReferenceNumber', type: 'varchar', length: 35, nullable: true })
  public referenceNumber: string | null;

  @Column({ name: 'ReasonCode', type: 'varchar', length: 10, nullable: true })
  public reasonCode: string | null;

  @Column({ name: 'ReasonCodeDescription', type: 'varchar', length: 250, nullable: true })
  public reasonCodeDescription: string | null;

  @Column({ name: 'ReasonText', type: 'varchar', length: 1000, nullable: true })
  public reasonText: string | null;

  @Column({ name: 'CBType', type: 'varchar', length: 5, nullable: true })
  public cbType: string | null;

  @Column({ name: 'CBTypeDescription', type: 'varchar', length: 50, nullable: true })
  public cbTypeDescription: string | null;

  @Column({ name: 'Disposition', type: 'varchar', length: 35, nullable: true })
  public disposition: string | null;

  @Column({ name: 'CBSequenceNumber', type: 'varchar', length: 15, nullable: true })
  public cbSequenceNumber: string | null;

  @Column({ name: 'RepresentedCBAmount', type: 'decimal', precision: 13, scale: 4, nullable: true })
  public representedCbAmount: number | null;

  @Column({ name: 'TransactionAmount', type: 'decimal', precision: 13, scale: 4, nullable: true })
  public transactionAmount: number | null;

  @Column({ name: 'AuthorizationCode', type: 'varchar', length: 10, nullable: true })
  public authorizationCode: string | null;

  @Column({ name: 'MerchantNumber', type: 'varchar', length: 20, nullable: true })
  public merchantNumber: string | null;

  @Column({ name: 'CreatedDate', type: 'datetime', nullable: true })
  public createdDate: Date | null;
} 