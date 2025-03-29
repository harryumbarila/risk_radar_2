import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblDFT256Batch' })
export class DFT256Batch {
  @PrimaryGeneratedColumn({ name: 'pkDFT256Batch' })
  public id: number;

  @Column({ name: 'sBankNum', length: 4, nullable: true })
  public bankNumber?: string;

  @Column({ name: 'dtTransmission', type: 'datetime', nullable: true })
  public transmissionDate?: Date;

  @Column({ name: 'iTransmissionNum', nullable: true })
  public transmissionNumber?: number;

  @Column({ name: 'iBatchNum', nullable: true })
  public batchNumber?: number;

  @Column({ name: 'iBatchSeqNum', nullable: true })
  public batchSequenceNumber?: number;

  @Column({
    name: 'dNetDepAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public netDepositAmount?: number;

  @Column({ name: 'sMID', length: 16, nullable: true })
  public merchantId?: string;

  @Column({ name: 'sMCC', length: 4, nullable: true })
  public merchantCategoryCode?: string;

  @Column({ name: 'sTID', length: 8, nullable: true })
  public terminalId?: string;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdAt: Date;
}
