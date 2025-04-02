import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblMerchantTIN', schema: 'dbo', database: 'CrescentView' })
export class MerchantTIN {
  @PrimaryGeneratedColumn()
  public pkMerchantTIN: number;

  @Column({ type: 'int', nullable: true })
  public fkAppointment?: number;

  @Column({ type: 'varchar', length: 16 })
  public sMID: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public sCompany?: string;

  @Column({ type: 'varchar', length: 9, nullable: true })
  public sTIN?: string;

  @Column({ type: 'datetime', nullable: true })
  public dtSentToIRS?: Date;

  @Column({ type: 'datetime', nullable: true })
  public dtReceivedFromIRS?: Date;

  @Column({ type: 'int', nullable: true })
  public fkIRSCode?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public sMerchantNameSent?: string;

  @Column({ type: 'datetime', nullable: true })
  public dtCreated?: Date;
}
