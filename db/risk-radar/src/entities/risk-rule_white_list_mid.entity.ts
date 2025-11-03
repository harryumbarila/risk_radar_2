import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tbl_risk_rule_white_list_mids', {
  schema: 'dbo',
  database: 'RiskRadar',
})
export class RiskRuleWhiteListMidEntity {
  @ApiProperty({
    description: 'Primary key identifier of the whitelist entry.',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'pk', type: 'bigint' })
  id: number;

  @ApiProperty({
    description: 'Merchant ID associated with this whitelist record.',
    example: 'MID123456789012',
  })
  @Column({ name: 'MId', type: 'varchar', length: 16, nullable: false })
  MId: string;

  @ApiProperty({
    description: 'Indicates whether the rule AH01 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH01', type: 'bit', default: false, nullable: false })
  AH01: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH02 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH02', type: 'bit', default: false, nullable: false })
  AH02: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH03 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH03', type: 'bit', default: false, nullable: false })
  AH03: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH04 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH04', type: 'bit', default: false, nullable: false })
  AH04: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH05 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH05', type: 'bit', default: false, nullable: false })
  AH05: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH06 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH06', type: 'bit', default: false, nullable: false })
  AH06: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH07 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH07', type: 'bit', default: false, nullable: false })
  AH07: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH08 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH08', type: 'bit', default: false, nullable: false })
  AH08: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH09 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH09', type: 'bit', default: false, nullable: false })
  AH09: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH10 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH10', type: 'bit', default: false, nullable: false })
  AH10: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH11 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH11', type: 'bit', default: false, nullable: false })
  AH11: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH12 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH12', type: 'bit', default: false, nullable: false })
  AH12: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH13 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH13', type: 'bit', default: false, nullable: false })
  AH13: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH14 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH14', type: 'bit', default: false, nullable: false })
  AH14: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH15 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH15', type: 'bit', default: false, nullable: false })
  AH15: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH16 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH16', type: 'bit', default: false, nullable: false })
  AH16: boolean;

  @ApiProperty({
    description: 'Date and time when the record was last updated.',
    example: '2025-11-03T13:29:51.000Z',
  })
  @CreateDateColumn({
    name: 'last_updated_date',
    type: 'datetime',
    default: () => 'getdate()',
    nullable: false,
  })
  lastUpdatedDate: Date;

  @ApiProperty({
    description: 'User who last updated the record.',
    example: 'system_admin',
    required: false,
  })
  @Column({
    name: 'last_updated_by',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  lastUpdatedBy?: string;
}
