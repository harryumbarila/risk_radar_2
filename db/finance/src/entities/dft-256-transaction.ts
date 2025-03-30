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

  @ManyToOne(() => DFT256Batch)
  @JoinColumn({ name: 'fkDFT256Batch' })
  public batch?: DFT256Batch;

  @Column({ name: 'iTransSeqNum', nullable: true })
  public transactionSequenceNumber?: number;

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

  @Column({ name: 'sCardNumF6', length: 6, nullable: true })
  public cardFirst6Digits?: string;

  @Column({ name: 'sCardNumL4', length: 4, nullable: true })
  public cardLast4Digits?: string;

  @Column({ name: 'sAuthCode', length: 6, nullable: true })
  public authorizationCode?: string;

  @Column({ name: 'sDebitNetworkIdentifier', length: 3, nullable: true })
  public debitNetworkIdentifier?: string;

  @Column({ name: 'sPOSEntryMode', length: 2, nullable: true })
  public posEntryMode?: string;

  @Column({ name: 'sAVSRespCode', length: 1, nullable: true })
  public avsResponseCode?: string;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdAt: Date;
}
