import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RiskRule } from './risk-rule.entity';
import { RiskRuleParam } from './risk-rule-param.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tbl_risk_rules_param_values', { schema: 'dbo', database: 'RiskRadar' })
export class RiskRuleParamValue {
  @ApiProperty({
    description: 'Primary key identifier of the parameter value.',
  })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @ApiProperty({
    description: 'Foreign key referencing the related rule parameter.',
    required: false,
  })
  @Column({ name: 'fk_risk_rules_params', type: 'int', nullable: true })
  ruleParamId?: number;

  @ApiProperty({
    description: 'Numeric value assigned to this parameter.',
    required: false,
  })
  @Column({ type: 'int', nullable: true })
  value?: number;

  @ApiProperty({
    description: 'Date from which this parameter value is effective.',
  })
  @Column({ name: 'effective_date', type: 'datetime' })
  effectiveDate: Date;

  @ApiProperty({
    description: 'The related risk rule.',
    type: () => RiskRule,
  })
  @ManyToOne(() => RiskRule, (rule) => rule.paramValues)
  @JoinColumn({ name: 'fk_risk_rules_params' })
  rule: RiskRule;

  @ApiProperty({
    description: 'The related rule parameter.',
    type: () => RiskRuleParam,
  })
  @ManyToOne(() => RiskRuleParam, (param) => param.values)
  @JoinColumn({ name: 'fk_risk_rules_params' })
  parameter: RiskRuleParam;

  @ApiProperty({ description: 'Record creation timestamp.' })
  @CreateDateColumn({ name: 'created_date', type: 'datetime' })
  createdAt: Date;
}
