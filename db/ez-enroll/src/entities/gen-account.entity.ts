import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'GEN_Account', schema: 'EZEnroll' })
export class EZEnrollGenAccount {
  @PrimaryColumn('nvarchar', { length: 15, name: 'AccountCode' })
  public accountCode!: string;

  @Column('nvarchar', { length: 100, name: 'WebSite' })
  public website?: string;

  @Column('nvarchar', { length: 16, name: 'MID16' })
  public mid16?: string;

  @Column('bit', { name: 'bRiskWatch' })
  public riskWatch!: boolean;
}
