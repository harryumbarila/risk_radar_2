import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tbl_risk_rule_white_list_mcc', {
  schema: 'dbo',
  database: 'RiskRadar',
})
export class RiskRuleWhiteListMccEntity {
  @ApiProperty({
    description: 'Primary key identifier of the record.',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @ApiProperty({
    description: 'Merchant Category Code (MCC).',
    example: '1234',
    maxLength: 4,
    required: true,
  })
  @Column({ name: 'MCC', type: 'varchar', length: 4, nullable: false })
  MCC: string;

  @ApiProperty({ description: 'Flag for rule AH01.', example: false })
  @Column({ name: 'AH01', type: 'bit', nullable: true })
  AH01?: boolean;

  @ApiProperty({ description: 'Flag for rule AH02.', example: false })
  @Column({ name: 'AH02', type: 'bit', nullable: true })
  AH02?: boolean;

  @ApiProperty({ description: 'Flag for rule AH03.', example: false })
  @Column({ name: 'AH03', type: 'bit', nullable: true })
  AH03?: boolean;

  @ApiProperty({ description: 'Flag for rule AH04.', example: false })
  @Column({ name: 'AH04', type: 'bit', nullable: true })
  AH04?: boolean;

  @ApiProperty({ description: 'Flag for rule AH05.', example: false })
  @Column({ name: 'AH05', type: 'bit', nullable: true })
  AH05?: boolean;

  @ApiProperty({ description: 'Flag for rule AH06.', example: false })
  @Column({ name: 'AH06', type: 'bit', nullable: true })
  AH06?: boolean;

  @ApiProperty({ description: 'Flag for rule AH07.', example: false })
  @Column({ name: 'AH07', type: 'bit', nullable: true })
  AH07?: boolean;

  @ApiProperty({ description: 'Flag for rule AH08.', example: false })
  @Column({ name: 'AH08', type: 'bit', nullable: true })
  AH08?: boolean;

  @ApiProperty({ description: 'Flag for rule AH09.', example: false })
  @Column({ name: 'AH09', type: 'bit', nullable: true })
  AH09?: boolean;

  @ApiProperty({ description: 'Flag for rule AH10.', example: false })
  @Column({ name: 'AH10', type: 'bit', nullable: true })
  AH10?: boolean;

  @ApiProperty({ description: 'Flag for rule AH11.', example: false })
  @Column({ name: 'AH11', type: 'bit', nullable: true })
  AH11?: boolean;

  @ApiProperty({ description: 'Flag for rule AH12.', example: false })
  @Column({ name: 'AH12', type: 'bit', nullable: true })
  AH12?: boolean;

  @ApiProperty({ description: 'Flag for rule AH13.', example: false })
  @Column({ name: 'AH13', type: 'bit', nullable: true })
  AH13?: boolean;

  @ApiProperty({ description: 'Flag for rule AH14.', example: false })
  @Column({ name: 'AH14', type: 'bit', nullable: true })
  AH14?: boolean;

  @ApiProperty({ description: 'Flag for rule AH15.', example: false })
  @Column({ name: 'AH15', type: 'bit', nullable: true })
  AH15?: boolean;

  @ApiProperty({ description: 'Flag for rule AH16.', example: false })
  @Column({ name: 'AH16', type: 'bit', nullable: true })
  AH16?: boolean;

  @ApiProperty({
    description: 'Date and time when this record was last updated.',
    example: '2025-11-03T09:27:51.000Z',
  })
  @CreateDateColumn({ name: 'last_updated_date', type: 'datetime' })
  lastUpdatedDate: Date;

  @ApiProperty({
    description: 'Username or system identifier that last updated this record.',
    example: 'system_user',
  })
  @Column({
    name: 'last_updated_by',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  lastUpdatedBy?: string;
}
