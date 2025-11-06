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

  @ApiProperty({ description: 'Flag for rule AH001.', example: false })
  @Column({ name: 'AH001', type: 'bit', nullable: true })
  AH001?: boolean;

  @ApiProperty({ description: 'Flag for rule AH002.', example: false })
  @Column({ name: 'AH002', type: 'bit', nullable: true })
  AH002?: boolean;

  @ApiProperty({ description: 'Flag for rule AH003.', example: false })
  @Column({ name: 'AH003', type: 'bit', nullable: true })
  AH003?: boolean;

  @ApiProperty({ description: 'Flag for rule AH004.', example: false })
  @Column({ name: 'AH004', type: 'bit', nullable: true })
  AH004?: boolean;

  @ApiProperty({ description: 'Flag for rule AH005.', example: false })
  @Column({ name: 'AH005', type: 'bit', nullable: true })
  AH005?: boolean;

  @ApiProperty({ description: 'Flag for rule AH006.', example: false })
  @Column({ name: 'AH006', type: 'bit', nullable: true })
  AH006?: boolean;

  @ApiProperty({ description: 'Flag for rule AH007.', example: false })
  @Column({ name: 'AH007', type: 'bit', nullable: true })
  AH007?: boolean;

  @ApiProperty({ description: 'Flag for rule AH008.', example: false })
  @Column({ name: 'AH008', type: 'bit', nullable: true })
  AH008?: boolean;

  @ApiProperty({ description: 'Flag for rule AH009.', example: false })
  @Column({ name: 'AH009', type: 'bit', nullable: true })
  AH009?: boolean;

  @ApiProperty({ description: 'Flag for rule AH010.', example: false })
  @Column({ name: 'AH010', type: 'bit', nullable: true })
  AH010?: boolean;

  @ApiProperty({ description: 'Flag for rule AH011.', example: false })
  @Column({ name: 'AH011', type: 'bit', nullable: true })
  AH011?: boolean;

  @ApiProperty({ description: 'Flag for rule AH012.', example: false })
  @Column({ name: 'AH012', type: 'bit', nullable: true })
  AH012?: boolean;

  @ApiProperty({ description: 'Flag for rule AH013.', example: false })
  @Column({ name: 'AH013', type: 'bit', nullable: true })
  AH013?: boolean;

  @ApiProperty({ description: 'Flag for rule AH014.', example: false })
  @Column({ name: 'AH014', type: 'bit', nullable: true })
  AH014?: boolean;

  @ApiProperty({ description: 'Flag for rule AH015.', example: false })
  @Column({ name: 'AH015', type: 'bit', nullable: true })
  AH015?: boolean;

  @ApiProperty({ description: 'Flag for rule AH016.', example: false })
  @Column({ name: 'AH016', type: 'bit', nullable: true })
  AH016?: boolean;

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
