import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'tbl_dft_auto_hold_file_processed',
  schema: 'TSYS',
  database: 'RiskRadar',
})
export class DftAutoHoldFileProcessed {
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @Column({ name: 'dtTransmission', type: 'datetime', nullable: true })
  transmissionDate?: Date;

  @Column({ name: 'iTransmissionNum', type: 'int', nullable: true })
  transmissionNumber?: number;

  @Column({ name: 'iBatchNum', type: 'int', nullable: true })
  batchNumber?: number;

  @Column({ name: 'processed_date', type: 'datetime', nullable: true })
  processedDate?: Date;

  @Column({ name: 'record_count', type: 'int', nullable: true })
  recordCount?: number;
}
