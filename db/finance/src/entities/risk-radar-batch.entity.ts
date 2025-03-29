import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tblRiskRadarBatch', { schema: 'finance' })
export class RiskRadarBatch {
  @PrimaryColumn({ name: 'pkDFT256Batch', type: 'int' })
  pkDFT256Batch: number;

  @Column({ name: 'sBankNum', type: 'varchar', length: 4, nullable: true })
  sBankNum: string;

  @Column({ name: 'dtTransmission', type: 'datetime', nullable: true })
  dtTransmission: Date;

  @Column({ name: 'iTransmissionNum', type: 'int', nullable: true })
  iTransmissionNum: number;

  @Column({ name: 'iBatchNum', type: 'int', nullable: true })
  iBatchNum: number;

  @Column({ name: 'iBatchSeqNum', type: 'int', nullable: true })
  iBatchSeqNum: number;

  @Column({
    name: 'dNetDepAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  dNetDepAmt: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  sMID: string;

  @Column({ name: 'sMCC', type: 'varchar', length: 4, nullable: true })
  sMCC: string;

  @Column({ name: 'sTID', type: 'varchar', length: 8, nullable: true })
  sTID: string;

  @Column({
    name: 'sAMEXOptBlueInd',
    type: 'varchar',
    length: 1,
    nullable: true,
  })
  sAMEXOptBlueInd: string;

  @Column({ name: 'dtCreated', type: 'datetime' })
  dtCreated: Date;

  @Column({ name: 'iKeyedPoints', type: 'int', nullable: true })
  iKeyedPoints: number;

  @Column({ name: 'iExceedMVPoints', type: 'int', nullable: true })
  iExceedMVPoints: number;

  @Column({ name: 'bNewAcct', type: 'bit' })
  bNewAcct: boolean;

  @Column({ name: 'iChbkExceedPoints', type: 'int', nullable: true })
  iChbkExceedPoints: number;

  @Column({ name: 'bNextDayFundingBatch', type: 'bit' })
  bNextDayFundingBatch: boolean;

  @Column({ name: 'iAutoHoldPoints', type: 'int', nullable: true })
  iAutoHoldPoints: number;

  @Column({ name: 'sFileName', type: 'varchar', length: 75, nullable: true })
  sFileName: string;

  @Column({ name: 'sCycle', type: 'varchar', length: 2, nullable: true })
  sCycle: string;

  @Column({ name: 'dtCreated_getdate', type: 'datetime', nullable: true })
  dtCreatedGetdate: Date;
}
