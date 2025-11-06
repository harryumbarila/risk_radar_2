import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tbl_merchant_risk_thresholds', {
  schema: 'dbo',
  database: 'RiskRadar',
})
export class MerchanRiskThresholdsEntity {
  @ApiProperty({
    description:
      'Primary key identifier of the merchant risk threshold record.',
    example: 1,
  })
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @ApiProperty({
    description: 'Merchant identifier (MID).',
    example: 'MID123456789012',
    maxLength: 16,
    required: false,
  })
  @Column({ name: 'MId', type: 'varchar', length: 16, nullable: true })
  mid?: string;

  @ApiProperty({
    description: 'Percentage of keyed (manually entered) transactions.',
    example: 15,
    required: false,
  })
  @Column({ name: 'keyed_percentage', type: 'int', nullable: true })
  keyedPercentage?: number;

  @ApiProperty({
    description: 'Maximum allowed monthly transaction volume for the merchant.',
    example: 250000,
    required: false,
  })
  @Column({ name: 'monthly_volume', type: 'int', nullable: true })
  monthlyVolume?: number;

  @ApiProperty({
    description: 'Maximum single transaction amount considered high-ticket.',
    example: 5000,
    required: false,
  })
  @Column({ name: 'high_ticket', type: 'int', nullable: true })
  highTicket?: number;

  @ApiProperty({
    description: 'Maximum number of transactions allowed per month.',
    example: 1200,
    required: false,
  })
  @Column({ name: 'transaction_count', type: 'int', nullable: true })
  transactionCount?: number;

  @ApiProperty({
    description: 'Allowed percentage of declined transactions.',
    example: 3,
    required: false,
  })
  @Column({ name: 'decline_percentage', type: 'int', nullable: true })
  declinePercentage?: number;

  @ApiProperty({
    description: 'Date and time when the record was last updated.',
    example: '2025-11-03T12:00:00.000Z',
    required: false,
  })
  @Column({
    name: 'last_updated_date',
    type: 'datetime',
    nullable: true,
    default: () => 'GETDATE()',
  })
  lastUpdatedDate?: Date;

  @ApiProperty({
    description: 'User or system account that last updated this record.',
    example: 'system_admin',
    maxLength: 25,
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
