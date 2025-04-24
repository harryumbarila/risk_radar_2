import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblMerchantTIN', schema: 'dbo', database: 'CrescentView' })
export class MerchantTIN {
  @PrimaryGeneratedColumn({ name: 'pkMerchantTIN' })
  public pkMerchantTIN: number;

  @Column({
    name: 'fkAppointment',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public fkAppointment?: string;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public sMID: string;

  @Column({ name: 'sCompany', type: 'varchar', length: 3, nullable: false })
  public sCompany: string;

  @Column({ name: 'sTIN', type: 'varchar', length: 9, nullable: true })
  public sTIN?: string;

  @Column({ name: 'dtSentToIRS', type: 'datetime', nullable: true })
  public dtSentToIRS?: Date;

  @Column({ name: 'dtReceivedFromIRS', type: 'datetime', nullable: true })
  public dtReceivedFromIRS?: Date;

  @Column({ name: 'fkIRSCode', type: 'int', nullable: false })
  public fkIRSCode: number;

  @Column({
    name: 'sMerchantNameSent',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  public sMerchantNameSent?: string;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public dtCreated: Date;
}
