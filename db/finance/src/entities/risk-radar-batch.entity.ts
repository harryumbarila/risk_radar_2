import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tblRiskRadarBatch', { schema: 'finance' })
export class RiskRadarBatch {
  @PrimaryColumn({ name: 'pkDFT256Batch', type: 'int' })
  public pkDFT256Batch: number;

  @Column({ name: 'sBankNum', type: 'varchar', length: 4, nullable: true })
  public sBankNum: string;

  @Column({ name: 'dtTransmission', type: 'datetime', nullable: true })
  public dtTransmission: Date;

  @Column({ name: 'iTransmissionNum', type: 'int', nullable: true })
  public iTransmissionNum: number;

  @Column({ name: 'iBatchNum', type: 'int', nullable: true })
  public iBatchNum: number;

  @Column({ name: 'iBatchSeqNum', type: 'int', nullable: true })
  public iBatchSeqNum: number;

  @Column({
    name: 'dNetDepAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public dNetDepAmt: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public sMID: string;

  @Column({ name: 'sMCC', type: 'varchar', length: 4, nullable: true })
  public sMCC: string;

  @Column({ name: 'sTID', type: 'varchar', length: 8, nullable: true })
  public sTID: string;

  @Column({
    name: 'sAMEXOptBlueInd',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  public sAMEXOptBlueInd: string;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public dtCreated: Date;

  @Column({ name: 'iKeyedPoints', type: 'int', nullable: true })
  public iKeyedPoints: number;

  @Column({ name: 'iExceedMVPoints', type: 'int', nullable: true })
  public iExceedMVPoints: number;

  @Column({ name: 'bNewAcct', type: 'bit' })
  public bNewAcct: boolean;

  @Column({ name: 'iChbkExceedPoints', type: 'int', nullable: true })
  public iChbkExceedPoints: number;

  @Column({ name: 'bNextDayFundingBatch', type: 'bit' })
  public bNextDayFundingBatch: boolean;

  @Column({ name: 'iAutoHoldPoints', type: 'int', nullable: true })
  public iAutoHoldPoints: number;

  @Column({ name: 'sFileName', type: 'varchar', length: 75, nullable: true })
  public sFileName: string;

  @Column({ name: 'sCycle', type: 'varchar', length: 2, nullable: true })
  public sCycle: string;

  @Column({ name: 'dtCreated_getdate', type: 'datetime', nullable: true })
  public dtCreatedGetdate: Date;
}
