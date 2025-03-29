import { Column, Entity } from 'typeorm';

@Entity('tblSnapShotvwNetSettlementBalanceActive')
export class SnapShotvwNetSettlementBalanceActive {
  @Column({ name: 'iOrder', type: 'int', nullable: true })
  public order: number | null;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public merchantId: string | null;

  @Column({ name: 'dSettlementBalance', type: 'decimal', precision: 18, scale: 2, nullable: true })
  public settlementBalance: number | null;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdDate: Date;
} 