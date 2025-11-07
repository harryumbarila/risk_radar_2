import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'tbl_adf_auto_hold_file_processed',
  schema: 'TSYS',
  database: 'RiskRadar',
})
export class AdfAutoHoldFileProcessed {
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @Column({ name: 'file_id', type: 'varchar', length: 255, nullable: true })
  fileId?: string;

  @Column({ name: 'processed_date', type: 'datetime', nullable: true })
  processedDate?: Date;

  @Column({ name: 'record_count', type: 'int', nullable: true })
  recordCount?: number;
}
