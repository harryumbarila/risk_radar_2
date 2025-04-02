import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblRiskRadarIssuingBanks' })
export class RiskRadarIssuingBank {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarIssuingBanks' })
  public id: number;

  @Column({ name: 'sBIN', length: 8 })
  public bin: string;

  @Column({ name: 'sIssuerName', length: 80 })
  public issuerName: string;

  @Column({ name: 'sIssuerCountry', length: 25 })
  public issuerCountry: string;

  @Column({ name: 'sIssuerPhone', length: 25, nullable: true })
  public issuerPhone?: string;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdAt: Date;
}
