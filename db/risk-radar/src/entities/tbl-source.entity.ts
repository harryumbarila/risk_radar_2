import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { RiskRule } from './risk-rule.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'tbl_source' })
export class RiskSource {
  @ApiProperty({ description: 'Primary key identifier of the source.' })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @ApiProperty({
    description: 'Definition or name of the source.',
    required: false,
    maxLength: 25,
  })
  @Column({ name: 'definition', type: 'varchar', length: 25, nullable: true })
  definition?: string;

  @ApiProperty({
    description: 'Collection of risk rules associated with this source.',
    type: () => RiskRule,
    isArray: true,
  })
  @OneToMany(() => RiskRule, (rule) => rule.source)
  rules: RiskRule[];

  @ApiProperty({ description: 'Record creation timestamp.' })
  @CreateDateColumn({ name: 'created_date', type: 'datetime' })
  createdAt: Date;
}
