import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tbl_risk_rule_white_list_mids_audit_log', {
  schema: 'dbo',
  database: 'RiskRadar',
})
export class RiskRuleWhiteListMidAuditLogEntity {
  @ApiProperty({
    description: 'Primary key identifier of the parameter value.',
  })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @Column({ name: 'MId', type: 'varchar', length: 16, nullable: true })
  MId?: string;

  @Column({ name: 'AH001', type: 'bit', nullable: true })
  AH001?: boolean;
  @Column({ name: 'AH002', type: 'bit', nullable: true })
  AH002?: boolean;
  @Column({ name: 'AH003', type: 'bit', nullable: true })
  AH003?: boolean;
  @Column({ name: 'AH004', type: 'bit', nullable: true })
  AH004?: boolean;
  @Column({ name: 'AH005', type: 'bit', nullable: true })
  AH005?: boolean;
  @Column({ name: 'AH006', type: 'bit', nullable: true })
  AH006?: boolean;
  @Column({ name: 'AH007', type: 'bit', nullable: true })
  AH007?: boolean;
  @Column({ name: 'AH008', type: 'bit', nullable: true })
  AH008?: boolean;
  @Column({ name: 'AH009', type: 'bit', nullable: true })
  AH009?: boolean;
  @Column({ name: 'AH010', type: 'bit', nullable: true })
  AH010?: boolean;
  @Column({ name: 'AH011', type: 'bit', nullable: true })
  AH011?: boolean;
  @Column({ name: 'AH012', type: 'bit', nullable: true })
  AH012?: boolean;
  @Column({ name: 'AH013', type: 'bit', nullable: true })
  AH013?: boolean;
  @Column({ name: 'AH014', type: 'bit', nullable: true })
  AH014?: boolean;
  @Column({ name: 'AH015', type: 'bit', nullable: true })
  AH015?: boolean;
  @Column({ name: 'AH016', type: 'bit', nullable: true })
  AH016?: boolean;

  @ApiProperty({ description: 'Record creation timestamp.' })
  @CreateDateColumn({ name: 'last_updated_date', type: 'datetime' })
  lastUpdatedDate: Date;
  @Column({
    name: 'last_updated_by',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  lastUpdatedBy: string;
}
