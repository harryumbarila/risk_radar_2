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
    description: 'Indicates whether the rule AH001 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH01', type: 'bit', default: false, nullable: false })
  AH001: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH002 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH02', type: 'bit', default: false, nullable: false })
  AH002: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH003 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH03', type: 'bit', default: false, nullable: false })
  AH003: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH004 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH04', type: 'bit', default: false, nullable: false })
  AH004: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH005 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH05', type: 'bit', default: false, nullable: false })
  AH005: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH006 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH06', type: 'bit', default: false, nullable: false })
  AH006: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH007 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH07', type: 'bit', default: false, nullable: false })
  AH007: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH008 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH08', type: 'bit', default: false, nullable: false })
  AH008: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH009 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH09', type: 'bit', default: false, nullable: false })
  AH009: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH010 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH10', type: 'bit', default: false, nullable: false })
  AH010: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH011 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH11', type: 'bit', default: false, nullable: false })
  AH011: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH012 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH12', type: 'bit', default: false, nullable: false })
  AH012: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH013 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH13', type: 'bit', default: false, nullable: false })
  AH013: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH014 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH14', type: 'bit', default: false, nullable: false })
  AH014: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH015 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH15', type: 'bit', default: false, nullable: false })
  AH015: boolean;

  @ApiProperty({
    description: 'Indicates whether the rule AH016 is active for this MID.',
    example: false,
  })
  @Column({ name: 'AH16', type: 'bit', default: false, nullable: false })
  AH016: boolean;

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
