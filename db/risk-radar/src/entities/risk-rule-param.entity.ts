import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { RiskRule } from './risk-rule.entity';
import { RiskRuleParamValue } from './risk-rule-param-value.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tbl_risk_rules_params', schema: 'dbo', database: 'RiskRadar' })
export class RiskRuleParam {
  @ApiProperty({ description: 'Primary key identifier of the rule parameter.' })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @ApiProperty({
    description: 'Foreign key referencing the parent risk rule.',
    required: false,
  })
  @Column({ name: 'fk_risk_rules', type: 'int', nullable: true })
  ruleId?: number;

  @ApiProperty({
    description: 'The related risk rule.',
    type: () => RiskRule,
  })
  @ManyToOne(() => RiskRule, (rule) => rule.parameters)
  @JoinColumn({ name: 'fk_risk_rules' })
  rule: RiskRule;

  @ApiProperty({
    description: 'Short name or code for the parameter.',
    required: false,
    maxLength: 10,
  })
  @Column({ name: 'short_name', type: 'varchar', length: 10, nullable: true })
  shortName?: string;

  @ApiProperty({
    description: 'Detailed definition or explanation of the parameter.',
    required: false,
    maxLength: 250,
  })
  @Column({ name: 'definition', type: 'varchar', length: 250, nullable: true })
  definition?: string;

  @ApiProperty({
    description:
      'List of parameter values associated with this rule parameter.',
    type: () => RiskRuleParamValue,
    isArray: true,
  })
  @OneToMany(() => RiskRuleParamValue, (value) => value.parameter)
  values: RiskRuleParamValue[];

  @ApiProperty({ description: 'Record creation timestamp.' })
  @CreateDateColumn({ name: 'created_date', type: 'datetime' })
  createdAt: Date;
}
