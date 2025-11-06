import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { RiskSource } from './tbl-source.entity';

@Entity({
  name: 'tbl_auto_hold_exception_summary',
  schema: 'dbo',
  database: 'RiskRadar',
})
export class AutoHoldExceptionSummary {
  @ApiProperty({
    description:
      'Primary key identifier of the auto-hold exception summary record.',
    example: 101,
  })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @ApiProperty({
    description: 'Foreign key referencing the associated risk source.',
    example: 5,
    required: false,
  })
  @Column({ name: 'fk_source', nullable: true })
  sourceId?: number;

  @ApiProperty({
    description:
      'Associated risk source entity containing definition and metadata.',
    type: () => RiskSource,
    required: false,
  })
  @ManyToOne(() => RiskSource, (source) => source.rules)
  @JoinColumn({ name: 'fk_source' })
  source: RiskSource;

  @ApiProperty({
    description:
      'Foreign key referencing ADF auto-hold file processing record.',
    example: 301,
    required: false,
  })
  @Column({ name: 'fk_adf_auto_hold_file_processed', nullable: true })
  adfFileProcessedId?: number;

  @ApiProperty({
    description:
      'Foreign key referencing DFT auto-hold file processing record.',
    example: 402,
    required: false,
  })
  @Column({ name: 'fk_dft_auto_hold_file_processed', nullable: true })
  dftFileProcessedId?: number;

  @ApiProperty({
    description:
      'Unique identifier of the data source (e.g., file batch ID or timestamp).',
    example: '20251105_001',
    maxLength: 50,
    required: false,
  })
  @Column({ name: 'data_source_identifier', length: 50, nullable: true })
  dataSourceIdentifier?: string;

  @ApiProperty({
    description:
      'Merchant Identifier (MID) related to the transaction or record.',
    example: 'MID1234567890',
    maxLength: 16,
    required: false,
  })
  @Column({ name: 'MId', length: 16, nullable: true })
  merchantId?: string;

  @ApiProperty({
    description:
      'Indicates if the transaction is a next-day transaction (NXDY flag).',
    example: true,
    required: false,
  })
  @Column({ name: 'NXDY', type: 'bit', nullable: true })
  isNextDay?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH001.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH001', type: 'bit', nullable: true })
  isAutoHold01?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH002.',
    example: true,
    required: false,
  })
  @Column({ name: 'AH002', type: 'bit', nullable: true })
  isAutoHold02?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH003.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH003', type: 'bit', nullable: true })
  isAutoHold03?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH004.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH004', type: 'bit', nullable: true })
  isAutoHold04?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH005.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH005', type: 'bit', nullable: true })
  isAutoHold05?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH006.',
    example: true,
    required: false,
  })
  @Column({ name: 'AH006', type: 'bit', nullable: true })
  isAutoHold06?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH007.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH007', type: 'bit', nullable: true })
  isAutoHold07?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH008.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH008', type: 'bit', nullable: true })
  isAutoHold08?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH009.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH009', type: 'bit', nullable: true })
  isAutoHold09?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH010.',
    example: true,
    required: false,
  })
  @Column({ name: 'AH010', type: 'bit', nullable: true })
  isAutoHold10?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH011.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH011', type: 'bit', nullable: true })
  isAutoHold11?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH012.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH012', type: 'bit', nullable: true })
  isAutoHold12?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH013.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH013', type: 'bit', nullable: true })
  isAutoHold13?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH014.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH014', type: 'bit', nullable: true })
  isAutoHold14?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH015.',
    example: false,
    required: false,
  })
  @Column({ name: 'AH015', type: 'bit', nullable: true })
  isAutoHold15?: boolean;

  @ApiProperty({
    description: 'Auto Hold flag AH016.',
    example: true,
    required: false,
  })
  @Column({ name: 'AH016', type: 'bit', nullable: true })
  isAutoHold16?: boolean;

  @ApiProperty({
    description:
      'Record creation timestamp. Defaults to the current date and time on insert.',
    example: '2025-11-06T10:00:00.000Z',
  })
  @CreateDateColumn({
    name: 'created_date',
    type: 'datetime',
    default: () => 'GETDATE()',
  })
  createdAt: Date;
}
