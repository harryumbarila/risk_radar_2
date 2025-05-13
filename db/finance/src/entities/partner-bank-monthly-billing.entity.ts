import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblMSPMerchantsMonthlyBilling' })
export class MSPMerchantMonthlyBilling {
  @PrimaryGeneratedColumn({ name: 'pk' })
  public id: number;

  @Column({ name: 'sYYYYMM', length: 6 })
  public sYYYYMM: string;

  @Column({ name: 'sMId', length: 50 })
  public mid: string;

  @Column({ name: 'dMMFSalesVolume', type: 'decimal', precision: 18, scale: 2 })
  public dMMFSalesVolume: number;

  @Column({ name: 'dMMFRate', type: 'decimal', precision: 10, scale: 6 })
  public dMMFRate: number;

  @Column({ name: 'dMMFBilledAmt', type: 'decimal', precision: 18, scale: 2 })
  public dMMFBilledAmt: number;

  @Column({ name: 'dtACHBilled', type: 'datetime', nullable: true })
  public dtACHBilled: Date | null;

  @Column({ name: 'dtInvoiced', type: 'datetime', nullable: true })
  public dtInvoiced: Date | null;

  @Column({ name: 'dtCreated', type: 'datetime', default: () => 'GETDATE()' })
  public dtCreated: Date;
}
