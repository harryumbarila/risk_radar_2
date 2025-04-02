import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblDDTMonthlyProcessingSummary', { schema: 'Finance.dbo' })
export class DdtMonthlyProcessingSummaryEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  public id: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public mid: string | null;

  @Column({ name: 'iYear', type: 'int', nullable: true })
  public year: number | null;

  @Column({ name: 'iMonth', type: 'int', nullable: true })
  public month: number | null;

  @Column({
    name: 'dVol',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public volume: number | null;

  @Column({ name: 'iTrans', type: 'int', nullable: true })
  public transactions: number | null;

  @Column({
    name: 'dAvgTkt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public averageTicket: number | null;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdDate: Date;

  @Column({ name: 'iSwipedPerc', type: 'int', nullable: true })
  public swipedPercentage: number | null;

  @Column({ name: 'iSwipedPercBasedOnTransCnt', type: 'int', nullable: true })
  public swipedPercentageBasedOnTransactionCount: number | null;

  @Column({
    name: 'dHighestTkt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public highestTicket: number | null;
}
