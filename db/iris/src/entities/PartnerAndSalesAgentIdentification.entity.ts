import { Entity, Column } from 'typeorm';

@Entity('tblPartnerAndSalesAgentIdentification')
export class PartnerAndSalesAgentIdentification {
  @Column({ name: 'sMId', type: 'varchar', length: 20, primary: true })
  public merchantId: string;

  @Column({ name: 'sChannel', type: 'varchar', length: 255, nullable: true })
  public channel: string | null;

  @Column({ name: 'sReseller', type: 'varchar', length: 255, nullable: true })
  public reseller: string | null;

  @Column({ name: 'sReferralPartner', type: 'varchar', length: 255, nullable: true })
  public referralPartner: string | null;

  @Column({ name: 'sSolutionConsultant', type: 'varchar', length: 255, nullable: true })
  public solutionConsultant: string | null;

  @Column({ name: 'sISV', type: 'varchar', length: 255, nullable: true }) 
  public isv: string | null;
} 