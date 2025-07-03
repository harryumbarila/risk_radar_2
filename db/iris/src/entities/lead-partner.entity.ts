import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LeadsPartner', schema: 'Iris.dbo' })
export class LeadsPartnerEntity {
  @PrimaryGeneratedColumn({ name: 'Id', type: 'bigint' })
  public id: number;

  @Column({ name: 'LeadId', type: 'bigint', nullable: true })
  public leadId?: number;

  @Column({ name: 'PartnerName', type: 'varchar', length: 100, nullable: true })
  public partnerName?: string;

  @Column({
    name: 'MainContactName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public mainContactName?: string;

  @Column({
    name: 'ContactTitle',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public contactTitle?: string;

  @Column({ name: 'ContactEmail', type: 'varchar', length: 50, nullable: true })
  public contactEmail?: string;

  @Column({ name: 'ContactPhone', type: 'varchar', length: 20, nullable: true })
  public contactPhone?: string;

  @Column({ name: 'HQAddress', type: 'varchar', length: 75, nullable: true })
  public hqAddress?: string;

  @Column({ name: 'City', type: 'varchar', length: 50, nullable: true })
  public city?: string;

  @Column({ name: 'State', type: 'varchar', length: 100, nullable: true })
  public state?: string;

  @Column({ name: 'Zip', type: 'varchar', length: 25, nullable: true })
  public zip?: string;

  @Column({
    name: 'PartnerCategory',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public partnerCategory?: string;

  @Column({ name: 'Priority', type: 'varchar', length: 100, nullable: true })
  public priority?: string;

  @Column({
    name: 'RelationshipManager',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public relationshipManager?: string;

  @Column({
    name: 'CurrentProvider',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public currentProvider?: string;

  @Column({ name: 'ProviderAgreementDate', type: 'datetime', nullable: true })
  public providerAgreementDate: Date | null;

  @Column({ name: 'ProviderNotifyDate', type: 'datetime', nullable: true })
  public providerNotifyDate: Date | null;

  @Column({ name: 'BranchOfficeCount', type: 'bigint', nullable: true })
  public branchOfficeCount?: string;

  @Column({ name: 'ProjectedMonthlyMIDs', type: 'bigint', nullable: true })
  public projectedMonthlyMIDs?: string;

  @Column({
    name: 'TotalAssets',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public totalAssets?: string;

  @Column({
    name: 'CAndILoanRatio',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public cAndILoanRatio?: string;

  @Column({ name: 'ExpectedWinDate', type: 'datetime', nullable: true })
  public expectedWinDate: Date | null;

  @Column({ name: 'StartDate', type: 'datetime', nullable: true })
  public startDate: Date | null;

  @Column({
    name: 'ExecutiveSponsor',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public executiveSponsor?: string;

  @Column({
    name: 'CommissionType',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public commissionType?: string;

  @Column({
    name: 'ActiveCommission',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public activeCommission?: string;

  @Column({
    name: 'ContractNotes',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  public contractNotes?: string;

  @Column({ name: 'NumberOfBusinessClients', type: 'bigint', nullable: true })
  public numberOfBusinessClients?: string;

  @Column({
    name: 'ImportedDate',
    type: 'datetime',
    default: () => 'getdate()',
  })
  public importedDate: Date;

  @Column({ name: 'UpdatedDate', type: 'datetime', nullable: true })
  public updatedDate: Date | null;

  @Column({
    name: 'TargetSalesTeams',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public targetSalesTeams?: string;

  @Column({
    name: 'TargetVerticals',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public targetVerticals?: string;

  @Column({
    name: 'EstimatedAnnualRevenue',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public estimatedAnnualRevenue?: string;

  @Column({
    name: 'SecondContactName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public secondContactName?: string;

  @Column({
    name: 'SecondContactTitle',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public secondContactTitle?: string;

  @Column({
    name: 'SecondContactPhone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public secondContactPhone?: string;

  @Column({
    name: 'SecondContactEmail',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public secondContactEmail?: string;

  @Column({
    name: 'ThirdContactName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public thirdContactName?: string;

  @Column({
    name: 'ThirdContactTitle',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public thirdContactTitle?: string;

  @Column({
    name: 'ThirdContactPhone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public thirdContactPhone?: string;

  @Column({
    name: 'ThirdContactEmail',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public thirdContactEmail?: string;

  @Column({
    name: 'FourthContactName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public fourthContactName?: string;

  @Column({
    name: 'FourthContactTitle',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public fourthContactTitle?: string;

  @Column({
    name: 'FourthContactPhone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public fourthContactPhone?: string;

  @Column({
    name: 'FourthContactEmail',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public fourthContactEmail?: string;

  @Column({ name: 'Comments', type: 'varchar', length: 300, nullable: true })
  public comments?: string;

  @Column({
    name: 'PrimarySalesPerson',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public primarySalesPerson?: string;

  @Column({
    name: 'CustomerServiceEmail',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public customerServiceEmail?: string;
}
