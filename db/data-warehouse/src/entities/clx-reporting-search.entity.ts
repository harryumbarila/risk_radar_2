import { Column, Entity } from 'typeorm';

@Entity({ name: '.CLXReportingSearch' })
export class CLXReportingSearch {
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

  @Column({ name: 'DrdNetwork', length: 5 })
  public drdNetwork: string;
}
