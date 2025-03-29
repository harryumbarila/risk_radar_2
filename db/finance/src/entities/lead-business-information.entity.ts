import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LeadsBusinessInformation' })
export class LeadsBusinessInformation {
  @PrimaryGeneratedColumn({ name: 'Id', type: 'bigint' })
  public id: number;

  @Column({ name: 'LeadId', type: 'bigint', nullable: true })
  public leadId: number | null;

  @Column({ name: 'LegalName', type: 'varchar', length: 100, nullable: true })
  public legalName: string | null;

  @Column({ name: 'DBAName', type: 'varchar', length: 100, nullable: true })
  public dbaName: string | null;

  @Column({ name: 'DBAAddress', type: 'varchar', length: 75, nullable: true })
  public dbaAddress: string | null;

  @Column({
    name: 'DBASuiteNumber',
    type: 'varchar',
    length: 75,
    nullable: true,
  })
  public dbaSuiteNumber: string | null;

  @Column({ name: 'DBACity', type: 'varchar', length: 50, nullable: true })
  public dbaCity: string | null;

  @Column({ name: 'DBAState', type: 'varchar', length: 100, nullable: true })
  public dbaState: string | null;

  @Column({ name: 'DBAZip', type: 'varchar', length: 25, nullable: true })
  public dbaZip: string | null;

  @Column({
    name: 'DBAPhoneNumber',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public dbaPhoneNumber: string | null;

  @Column({ name: 'ContactName', type: 'varchar', length: 100, nullable: true })
  public contactName: string | null;

  @Column({ name: 'ContactTitle', type: 'varchar', length: 50, nullable: true })
  public contactTitle: string | null;

  @Column({
    name: 'ContactPhoneNumber',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public contactPhoneNumber: string | null;

  @Column({
    name: 'DBALocationFax',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public dbaLocationFax: string | null;

  @Column({
    name: 'ContactEmailAddress',
    type: 'varchar',
    length: 75,
    nullable: true,
  })
  public contactEmailAddress: string | null;

  @Column({ name: 'LegalAddress', type: 'varchar', length: 75, nullable: true })
  public legalAddress: string | null;

  @Column({
    name: 'LegalSuiteNumber',
    type: 'varchar',
    length: 75,
    nullable: true,
  })
  public legalSuiteNumber: string | null;

  @Column({ name: 'LegalCity', type: 'varchar', length: 50, nullable: true })
  public legalCity: string | null;

  @Column({ name: 'LegalState', type: 'varchar', length: 100, nullable: true })
  public legalState: string | null;

  @Column({ name: 'LegalZIP', type: 'varchar', length: 25, nullable: true })
  public legalZIP: string | null;

  @Column({ name: 'Website', type: 'varchar', length: 200, nullable: true })
  public website: string | null;

  @Column({
    name: 'OwnershipType',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public ownershipType: string | null;

  @Column({
    name: 'BusinessType',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public businessType: string | null;

  @Column({ name: 'MccCode', type: 'varchar', length: 100, nullable: true })
  public mccCode: string | null;

  @Column({
    name: 'MccDescription',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  public mccDescription: string | null;

  @Column({
    name: 'ProductServicesSold',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public productServicesSold: string | null;

  @Column({ name: 'BusinessStartDate', type: 'datetime', nullable: true })
  public businessStartDate: Date | null;

  @Column({
    name: 'YearsInBusiness',
    type: 'varchar',
    length: 40,
    nullable: true,
  })
  public yearsInBusiness: string | null;

  @Column({ name: 'FederalTaxId', type: 'varchar', length: 15, nullable: true })
  public federalTaxId: string | null;

  @Column({
    name: 'ConfirmFederalTaxId',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  public confirmFederalTaxId: string | null;

  @Column({
    name: 'ImportedDate',
    type: 'datetime',
    nullable: true,
    default: () => 'GETDATE()',
  })
  public importedDate: Date | null;

  @Column({
    name: 'UpdatedDate',
    type: 'datetime',
    nullable: true,
    default: () => 'GETDATE()',
  })
  public updatedDate: Date | null;

  @Column({ name: 'TLNHidden', type: 'varchar', length: 40, nullable: true })
  public tlnHidden: string | null;

  @Column({ name: 'TINType', type: 'varchar', length: 100, nullable: true })
  public tinType: string | null;

  @Column({ name: 'YearsApplicantOwnedBus', type: 'int', nullable: true })
  public yearsApplicantOwnedBus: number | null;

  @Column({
    name: 'SendStatementTo',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public sendStatementTo: string | null;

  @Column({
    name: 'SendRetrievalsTo',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public sendRetrievalsTo: string | null;

  @Column({
    name: 'StatementIndicator',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public statementIndicator: string | null;

  @Column({
    name: 'PreviousMIDNumber',
    type: 'varchar',
    length: 75,
    nullable: true,
  })
  public previousMidNumber: string | null;
}
