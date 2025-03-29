/* eslint-disable import/no-cycle */
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Leads } from './Leads.entity';

@Entity('LeadsBusinessInformation')
export class LeadsBusinessInformation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  public Id: number;

  @Column({ type: 'bigint', nullable: true })
  public LeadId: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public LegalName: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public DBAName: string | null;

  @Column({ type: 'varchar', length: 75, nullable: true })
  public DBAAddress: string | null;

  @Column({ type: 'varchar', length: 75, nullable: true })
  public DBASuiteNumber: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public DBACity: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public DBAState: string | null;

  @Column({ type: 'varchar', length: 25, nullable: true })
  public DBAZip: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  public DBAPhoneNumber: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public ContactName: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public ContactTitle: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  public ContactPhoneNumber: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  public DBALocationFax: string | null;

  @Column({ type: 'varchar', length: 75, nullable: true })
  public ContactEmailAddress: string | null;

  @Column({ type: 'varchar', length: 75, nullable: true })
  public LegalAddress: string | null;

  @Column({ type: 'varchar', length: 75, nullable: true })
  public LegalSuiteNumber: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  public LegalCity: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public LegalState: string | null;

  @Column({ type: 'varchar', length: 25, nullable: true })
  public LegalZIP: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  public Website: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public OwnershipType: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public BusinessType: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public MccCode: string | null;

  @Column({ type: 'varchar', length: 250, nullable: true })
  public MccDescription: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  public ProductServicesSold: string | null;

  @Column({ type: 'datetime', nullable: true })
  public BusinessStartDate: Date | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  public YearsInBusiness: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  public FederalTaxId: string | null;

  @Column({ type: 'varchar', length: 15, nullable: true })
  public ConfirmFederalTaxId: string | null;

  @Column({ type: 'datetime', nullable: true })
  public ImportedDate: Date | null;

  @Column({ type: 'datetime', nullable: true })
  public UpdatedDate: Date | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  public TLNHidden: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public TINType: string | null;

  @Column({ type: 'int', nullable: true })
  public YearsApplicantOwnedBus: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public SendStatementTo: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public SendRetrievalsTo: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  public StatementIndicator: string | null;

  @Column({ type: 'varchar', length: 75, nullable: true })
  public PreviousMIDNumber: string | null;

  @OneToOne(() => Leads, (lead) => lead.BusinessInformation)
  @JoinColumn({ name: 'LeadId' })
  public Lead: Leads;
}
