import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { DFT256Batch } from './dft-256-batch';

@Entity({ name: 'tblDFT256Transaction' })
export class DFT256Transaction {
  @PrimaryGeneratedColumn({ name: 'pkDFT256Transaction' })
  public id: number;

  @Column({ name: 'fkDFT256Batch', type: 'int', nullable: true })
  public batchId?: number;

  @ManyToOne(() => DFT256Batch)
  @JoinColumn({ name: 'fkDFT256Batch' })
  public batch?: DFT256Batch;

  @Column({ name: 'iTransSeqNum', type: 'int', nullable: true })
  public transactionSequenceNumber?: number;

  @Column({
    name: 'sAcqInternalRefNum',
    type: 'varchar',
    length: 11,
    nullable: true,
  })
  public acquirerInternalRefNum?: string;

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
  public cardFirst6Digits?: string;

  @Column({ name: 'sCardNumL4', type: 'varchar', length: 4, nullable: true })
  public cardLast4Digits?: string;

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
  public createdAt: Date;

  @Column({ name: 'sTransID', type: 'varchar', length: 15, nullable: true })
  public transactionId?: string;

  @Column({
    name: 'dAuthAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public authorizationAmount?: number;

  @Column({
    name: 'sTransIntClass',
    type: 'varchar',
    length: 2,
    nullable: true,
  })
  public transactionIntClass?: string;

  @Column({ name: 'sCardExp', type: 'varchar', length: 4, nullable: true })
  public cardExpiration?: string;

  @Column({
    name: 'sEXPOSEntryMode',
    type: 'varchar',
    length: 3,
    nullable: true,
  })
  public expPosEntryMode?: string;

  @Column({
    name: 'sDIAVSResponseCode',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  public diAvsResponseCode?: string;

  @Column({ name: 'sCardType', type: 'varchar', length: 1, nullable: true })
  public cardType?: string;

  @Column({
    name: 'sPS2000TransId',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  public ps2000TransactionId?: string;

  @Column({ name: 'sTransCode', type: 'varchar', length: 4, nullable: true })
  public transactionCode?: string;

  @Column({ name: 'sProcessDesc', type: 'varchar', length: 2, nullable: true })
  public processDescription?: string;
}
