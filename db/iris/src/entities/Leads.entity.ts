import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { LeadsBusinessInformation } from './LeadsBusinessInformation.entity';

@Entity('Leads')
export class Leads {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public Id: number;

  @Column({ type: 'bigint', nullable: true, unique: true })
  public IrisLeadId: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public LeadName: string | null;

  @Column({ type: 'int', nullable: true })
  public GroupId: number | null;

  @Column({ type: 'int', nullable: true })
  public CategoryId: number | null;

  @Column({ type: 'int', nullable: true })
  public StatusId: number | null;

  @Column({ type: 'int', nullable: true })
  public CampaignId: number | null;

  @Column({ type: 'int', nullable: true })
  public SourceId: number | null;

  @Column({ type: 'datetime', nullable: true })
  public IrisCreatedDate: Date | null;

  @Column({ type: 'datetime', nullable: true })
  public IrisModifiedDate: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  public IrisMId: string | null;

  @Column({ type: 'datetime', nullable: true })
  public ImportedDate: Date | null;

  @Column({ type: 'datetime', nullable: true })
  public UpdatedDate: Date | null;

  @Column({ type: 'bit' })
  public IsArchived: boolean;

  @OneToOne(
    () => LeadsBusinessInformation,
    (leadsBusinessInformation) => leadsBusinessInformation.Lead
  )
  @OneToOne('LeadsBusinessInformation', 'Lead')
  public BusinessInformation: LeadsBusinessInformation;
}
