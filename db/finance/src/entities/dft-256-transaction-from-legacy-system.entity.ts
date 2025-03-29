import { Column, Entity } from 'typeorm';

@Entity({ name: 'tblDFT256TransactionFromLegacySystem' })
export class DFT256TransactionFromLegacySystem {
  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public merchantId?: string;

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

  @Column({ name: 'sPOSEntryMode', type: 'varchar', length: 2, nullable: true })
  public posEntryMode?: string;

  @Column({ name: 'sAVSRespCode', type: 'varchar', length: 1, nullable: true })
  public avsResponseCode?: string;

  @Column({ name: 'sAuthCode', type: 'varchar', length: 6, nullable: true })
  public authorizationCode?: string;

  @Column({ name: 'sCardNumF6', type: 'varchar', length: 6, nullable: true })
  public cardFirstSix?: string;

  @Column({ name: 'sCardNumL4', type: 'varchar', length: 4, nullable: true })
  public cardLastFour?: string;

  @Column({
    name: 'sDebitNetworkIdentifier',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  public debitNetworkIdentifier?: string;

  @Column({ name: 'dtTransmission', type: 'datetime', nullable: true })
  public transmissionDate?: Date;

  @Column({
    name: 'dNetDepAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public netDepositAmount?: number;
}
