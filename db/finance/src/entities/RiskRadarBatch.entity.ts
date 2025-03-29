import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tblRiskRadarBatch')
export class RiskRadarBatch {
  @PrimaryGeneratedColumn({ name: 'pkDFT256Batch' })
  public id: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16 })
  public merchantId: string;

  @Column({ name: 'sAMEXOptBlueInd', type: 'char', length: 1, nullable: true })
  public amexOptBlueInd: string | null;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: true })
  public createdDate: Date | null;
} 