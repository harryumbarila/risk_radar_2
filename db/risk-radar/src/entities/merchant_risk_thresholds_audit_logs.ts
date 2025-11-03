import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tbl_merchant_risk_thresholds_audit_log', { schema: 'dbo', database: 'RiskRadar' })
export class MerchanRiskThresholdsAuditLogsEntity {
 
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @Column({ name: 'MId', type: 'varchar', length: 16, nullable: true })
  MId?: string;

  @Column({ name: 'keyed_percentage', type: 'int', nullable: true })
  keyedPercentage?: number;

  @Column({ name: 'monthly_volume', type: 'int', nullable: true })
  monthlyVolume?: number;

  @Column({ name: 'high_ticket', type: 'int', nullable: true })
  highTicket?: number;

  @Column({ name: 'transaction_count', type: 'int', nullable: true })
  transactionCount?: number;

  @Column({ name: 'decline_percentage', type: 'int', nullable: true })
  declinePercentage?: number;

  @Column({ name: 'last_updated_date', type: 'datetime', nullable: true, default: () => 'GETDATE()' })
  lastUpdatedDate?: Date;

  @Column({ name: 'last_updated_by', type: 'varchar', length: 25, nullable: true })
  lastUpdatedBy?: string;
}
