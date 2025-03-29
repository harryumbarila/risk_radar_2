import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('Leads')
@Unique(['irisLeadId'])
export class LeadsEntity {
  @PrimaryGeneratedColumn('increment', { name: 'Id' })
  public id: number;

  @Column({ name: 'IrisLeadId', type: 'bigint', nullable: true })
  public irisLeadId: number | null;

  @Column({ name: 'LeadName', type: 'varchar', length: 255, nullable: true })
  public leadName: string | null;

  @Column({ name: 'GroupId', type: 'int', nullable: true })
  public groupId: number | null;

  @Column({ name: 'CategoryId', type: 'int', nullable: true })
  public categoryId: number | null;

  @Column({ name: 'StatusId', type: 'int', nullable: true })
  public statusId: number | null;

  @Column({ name: 'CampaignId', type: 'int', nullable: true })
  public campaignId: number | null;

  @Column({ name: 'SourceId', type: 'int', nullable: true })
  public sourceId: number | null;

  @Column({ name: 'IrisCreatedDate', type: 'datetime', nullable: true })
  public irisCreatedDate: Date | null;

  @Column({ name: 'IrisModifiedDate', type: 'datetime', nullable: true })
  public irisModifiedDate: Date | null;

  @Column({ name: 'IrisMId', type: 'varchar', length: 20, nullable: true })
  public irisMId: string | null;

  @Column({ name: 'ImportedDate', type: 'datetime', nullable: true })
  public importedDate: Date | null;

  @Column({ name: 'UpdatedDate', type: 'datetime', nullable: true })
  public updatedDate: Date | null;

  @Column({ name: 'IsArchived', type: 'boolean', default: false })
  public isArchived: boolean;
}
