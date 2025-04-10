import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'clx.CLXReportingSearch' })
export class CLXReportingSearch {
  @PrimaryColumn({ name: 'Id' })
  public id: number;

  @Column({ name: 'SiteID', length: 25 })
  public siteId: string;

  @Column({ name: 'TransactionDateTime', length: 30 })
  public transactionDateTime: string;

  @Column({ name: 'Amount', type: 'decimal', precision: 12, scale: 2 })
  public amount: number;

  @Column({ name: 'PosData', length: 20 })
  public posData: string;

  @Column({ name: 'AuthCode', length: 10 })
  public authorizationCode: string;

  @Column({ name: 'AccountNumber', length: 25 })
  public accountNumber: string;

  @Column({ name: 'AccountNumberF6', length: 6 })
  public accountNumberF6: string;

  @Column({ name: 'AccountNumberL4', length: 4 })
  public accountNumberL4: string;

  @Column({ name: 'DrdNetwork', length: 5 })
  public drdNetwork: string;
}
