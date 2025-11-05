import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RiskRule } from './risk-rule.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tbl_rule_type' })
export class RiskRuleType {
  @ApiProperty({ description: 'Primary key identifier of the rule type.' })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @ApiProperty({
    description: 'Short code for the rule type.',
    required: false,
    maxLength: 2,
  })
  @Column({ name: 'code', type: 'varchar', length: 2, nullable: true })
  code?: string;

  @ApiProperty({
    description: 'Definition or meaning of the rule type.',
    required: false,
    maxLength: 25,
  })
  @Column({ name: 'definition', type: 'varchar', length: 25, nullable: true })
  definition?: string;

  @ApiProperty({
    description: 'Collection of risk rules under this type.',
    type: () => RiskRule,
    isArray: true,
  })
  @OneToMany(() => RiskRule, (rule) => rule.ruleType)
  rules: RiskRule[];

  @ApiProperty({ description: 'Record creation timestamp.' })
  @CreateDateColumn({ name: 'created_date', type: 'datetime' })
  createdAt: Date;
}
