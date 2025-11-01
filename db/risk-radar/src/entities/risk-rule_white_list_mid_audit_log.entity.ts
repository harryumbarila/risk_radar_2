import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tbl_risk_rule_white_list_mids_audit_log', { schema: 'dbo', database: 'RiskRadar' })
export class RiskRuleWhiteListMidAuditLogEntity {
  @ApiProperty({
    description: 'Primary key identifier of the parameter value.',
  })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @Column({ name: 'MId', type: 'varchar', length: 16, nullable: true })
  MId?: string;

  @Column({ name: 'AH01', type: 'bit', nullable: true })
  AH01?: boolean;
  @Column({ name: 'AH02', type: 'bit', nullable: true })
  AH02?: boolean;
  @Column({ name: 'AH03', type: 'bit', nullable: true })
  AH03?: boolean;
  @Column({ name: 'AH04', type: 'bit', nullable: true })
  AH04?: boolean;
  @Column({ name: 'AH05', type: 'bit', nullable: true })
  AH05?: boolean;
  @Column({ name: 'AH06', type: 'bit', nullable: true })
  AH06?: boolean;
  @Column({ name: 'AH07', type: 'bit', nullable: true })
  AH07?: boolean;
  @Column({ name: 'AH08', type: 'bit', nullable: true })
  AH08?: boolean;
  @Column({ name: 'AH09', type: 'bit', nullable: true })
  AH09?: boolean;
  @Column({ name: 'AH10', type: 'bit', nullable: true })
  AH10?: boolean;
  @Column({ name: 'AH11', type: 'bit', nullable: true })
  AH11?: boolean;
  @Column({ name: 'AH12', type: 'bit', nullable: true })
  AH12?: boolean;
  @Column({ name: 'AH13', type: 'bit', nullable: true })
  AH13?: boolean;
  @Column({ name: 'AH14', type: 'bit', nullable: true })
  AH14?: boolean;
  @Column({ name: 'AH15', type: 'bit', nullable: true })
  AH15?: boolean;
  @Column({ name: 'AH16', type: 'bit', nullable: true })
  AH16?: boolean;

  @ApiProperty({ description: 'Record creation timestamp.' })
  @CreateDateColumn({ name: 'last_updated_date', type: 'datetime' })
  lastUpdatedDate: Date;
  @Column({ name: 'last_updated_by', type: 'varchar', length: 25, nullable: true })
  lastUpdatedBy: string;
}
