import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblDFT256Batch' })
export class DFT256Batch {
  @PrimaryGeneratedColumn({ name: 'pkDFT256Batch' })
  public id: number;

  @Column({ name: 'sBankNum', type: 'varchar', length: 4, nullable: true })
  public bankNumber?: string;

  @Column({ name: 'dtTransmission', type: 'datetime', nullable: true })
  public transmissionDate?: Date;

  @Column({ name: 'iTransmissionNum', type: 'int', nullable: true })
  public transmissionNumber?: number;

  @Column({ name: 'iBatchNum', type: 'int', nullable: true })
  public batchNumber?: number;

  @Column({ name: 'iBatchSeqNum', type: 'int', nullable: true })
  public batchSequenceNumber?: number;

  @Column({
    name: 'dNetDepAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public netDepositAmount?: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public merchantId?: string;

  @Column({ name: 'sMCC', type: 'varchar', length: 4, nullable: true })
  public merchantCategoryCode?: string;

  @Column({ name: 'sTID', type: 'varchar', length: 8, nullable: true })
  public terminalId?: string;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdAt: Date;

  @Column({
    name: 'sAMEXOptBlueInd',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  public amexOptBlueInd?: string;

  @Column({ name: 'sFileName', type: 'varchar', length: 75, nullable: true })
  public fileName?: string;

  @Column({ name: 'sCycle', type: 'varchar', length: 2, nullable: true })
  public cycle?: string;

  @Column({ name: 'sBHTransCode', type: 'varchar', length: 4, nullable: true })
  public bhTransCode?: string;

  @Column({
    name: 'sMerchDepositDate',
    type: 'varchar',
    length: 6,
    nullable: true,
  })
  public merchantDepositDate?: string;

  @Column({
    name: 'sBeginningTransRefNum',
    type: 'varchar',
    length: 11,
    nullable: true,
  })
  public beginningTransRefNum?: string;
}
