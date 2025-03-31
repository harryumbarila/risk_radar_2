import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'finance.dbo.dailydetail_authresp_lookup' })
export class AuthResponseLookup {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  public code: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  public definition: string;
}
