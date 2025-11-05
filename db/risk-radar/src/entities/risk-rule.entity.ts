import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RiskRuleParamValue } from './risk-rule-param-value.entity';
import { RiskRuleParam } from './risk-rule-param.entity';
import { RiskSource } from './tbl-source.entity';
import { RiskRuleType } from './rule-type.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tbl_risk_rules', { schema: 'dbo', database: 'RiskRadar' })
export class RiskRule {
  @ApiProperty({ description: 'Primary key identifier of the risk rule.' })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @ApiProperty({
    description: 'Foreign key referencing the risk source.',
    required: false,
  })
  @Column({ name: 'fk_source', type: 'int', nullable: true })
  sourceId?: number;

  @ApiProperty({
    description: 'Foreign key referencing the rule type.',
    required: false,
  })
  @Column({ name: 'fk_rule_type', type: 'int', nullable: true })
  ruleTypeId?: number;

  @ApiProperty({
    description: 'Detailed definition or explanation of the rule.',
    required: false,
    maxLength: 250,
  })
  @Column({ length: 250, nullable: true })
  definition?: string;

  @ApiProperty({
    description: 'Collection of parameter values linked to this rule.',
    type: () => RiskRuleParamValue,
    isArray: true,
  })
  @OneToMany(() => RiskRuleParamValue, (paramValue) => paramValue.rule)
  paramValues: RiskRuleParamValue[];

  @ApiProperty({
    description: 'Collection of parameters linked to this rule.',
    type: () => RiskRuleParam,
    isArray: true,
  })
  @OneToMany(() => RiskRuleParam, (param) => param.rule)
  parameters: RiskRuleParam[];

  @ApiProperty({
    description: 'Associated risk source entity.',
    type: () => RiskSource,
  })
  @ManyToOne(() => RiskSource, (source) => source.rules)
  @JoinColumn({ name: 'fk_source' })
  source: RiskSource;

  @ApiProperty({
    description: 'Associated rule type entity.',
    type: () => RiskRuleType,
  })
  @ManyToOne(() => RiskRuleType, (ruleType) => ruleType.rules)
  @JoinColumn({ name: 'fk_rule_type' })
  ruleType: RiskRuleType;

  @ApiProperty({ description: 'Record creation timestamp.' })
  @CreateDateColumn({ name: 'created_date', type: 'datetime' })
  createdAt: Date;
}
