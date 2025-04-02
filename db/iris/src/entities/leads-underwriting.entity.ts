import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('LeadsUnderwriting', { schema: 'Iris.dbo' })
export class LeadsUnderwritingEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Column({ name: 'LeadId', type: 'bigint', nullable: true })
  public leadId: number | null;

  @Column({
    name: 'AverageMonthlySalesVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public averageMonthlySalesVolume: number | null;

  @Column({
    name: 'AvgAXMonthlySalesVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public avgAxMonthlySalesVolume: number | null;

  @Column({
    name: 'DiscountType',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public discountType: string | null;

  @Column({
    name: 'HighestTicketSizeAmount',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public highestTicketSizeAmount: number | null;

  @Column({
    name: 'AverageTicketSizeAmount',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public averageTicketSizeAmount: number | null;

  @Column({
    name: 'AMEXAverageTicket',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public amexAverageTicket: number | null;

  @Column({
    name: 'NewAccountHold',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public newAccountHold: string | null;

  @Column({
    name: 'RollingReservePercentage',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public rollingReservePercentage: number | null;

  @Column({ name: 'ReserveCeiling', type: 'int', nullable: true })
  public reserveCeiling: number | null;

  @Column({ name: 'NextDayFunding', type: 'bit', nullable: true })
  public nextDayFunding: boolean | null;

  @Column({ name: 'DailyTransactionLimit', type: 'bigint', nullable: true })
  public dailyTransactionLimit: number | null;

  @Column({
    name: 'ProductServicesCategory',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public productServicesCategory: string | null;

  @Column({ name: 'MCCSICCode', type: 'varchar', length: 100, nullable: true })
  public mccSicCode: string | null;

  @Column({ name: 'ERGPricing', type: 'varchar', length: 100, nullable: true })
  public ergPricing: string | null;

  @Column({
    name: 'OFACDBAandPrincipals',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public ofacDbaAndPrincipals: string | null;

  @Column({ name: 'OFACUpdatedDate', type: 'datetime', nullable: true })
  public ofacUpdatedDate: Date | null;

  @Column({
    name: 'OFACUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public ofacUpdatedBy: string | null;

  @Column({ name: 'MATCH', type: 'varchar', length: 100, nullable: true })
  public match: string | null;

  @Column({ name: 'MATCHUpdatedDate', type: 'datetime', nullable: true })
  public matchUpdatedDate: Date | null;

  @Column({
    name: 'MATCHUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public matchUpdatedBy: string | null;

  @Column({
    name: 'EquipServicesSelected',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public equipServicesSelected: string | null;

  @Column({ name: 'EquipServicUpdatedDate', type: 'datetime', nullable: true })
  public equipServicUpdatedDate: Date | null;

  @Column({
    name: 'EquipServicesUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public equipServicesUpdatedBy: string | null;

  @Column({
    name: 'ArticlesOfIncorporation',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public articlesOfIncorporation: string | null;

  @Column({ name: 'AOIUpdatedDate', type: 'datetime', nullable: true })
  public aoiUpdatedDate: Date | null;

  @Column({
    name: 'AOIUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public aoiUpdatedBy: string | null;

  @Column({ name: 'IRSTINCheck', type: 'varchar', length: 100, nullable: true })
  public irsTinCheck: string | null;

  @Column({ name: 'TINCheckUpdatedDate', type: 'datetime', nullable: true })
  public tinCheckUpdatedDate: Date | null;

  @Column({
    name: 'TINCheckUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public tinCheckUpdatedBy: string | null;

  @Column({
    name: 'GoogleResults',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public googleResults: string | null;

  @Column({ name: 'GoogleUpdatedDate', type: 'datetime', nullable: true })
  public googleUpdatedDate: Date | null;

  @Column({
    name: 'GoogleUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public googleUpdatedBy: string | null;

  @Column({
    name: 'DBAPhoneSpyDialer',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public dbaPhoneSpyDialer: string | null;

  @Column({ name: 'DBASpyDialerUpdatedDate', type: 'datetime', nullable: true })
  public dbaSpyDialerUpdatedDate: Date | null;

  @Column({
    name: 'DBASpyDialerUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public dbaSpyDialerUpdatedBy: string | null;

  @Column({
    name: 'WebsiteScreenshots',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public websiteScreenshots: string | null;

  @Column({ name: 'ScreenshotUpdatedDate', type: 'datetime', nullable: true })
  public screenshotUpdatedDate: Date | null;

  @Column({
    name: 'ScreenshotUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public screenshotUpdatedBy: string | null;

  @Column({ name: 'Statements', type: 'varchar', length: 100, nullable: true })
  public statements: string | null;

  @Column({ name: 'StatementsUpdatedDate', type: 'datetime', nullable: true })
  public statementsUpdatedDate: Date | null;

  @Column({
    name: 'StatementsUpdatedBy',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public statementsUpdatedBy: string | null;

  @Column({
    name: 'OwnerOneFirstName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public ownerOneFirstName: string | null;

  @Column({
    name: 'OwnerOneLastName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public ownerOneLastName: string | null;

  @Column({
    name: 'CreditReportResults',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public creditReportResults: string | null;

  @Column({ name: 'CreditLastRequest', type: 'datetime', nullable: true })
  public creditLastRequest: Date | null;

  @Column({
    name: 'OwnerTwoFirstName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public ownerTwoFirstName: string | null;

  @Column({
    name: 'OwnerTwoLastName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public ownerTwoLastName: string | null;

  @Column({
    name: 'CreditReportResultsSecond',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public creditReportResultsSecond: string | null;

  @Column({ name: 'OFACCreditLastRequest', type: 'datetime', nullable: true })
  public ofacCreditLastRequest: Date | null;

  @Column({ name: 'OFACResults', type: 'varchar', length: 200, nullable: true })
  public ofacResults: string | null;

  @Column({ name: 'OFACLastRequest', type: 'datetime', nullable: true })
  public ofacLastRequest: Date | null;

  @Column({
    name: 'IdentityResults',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public identityResults: string | null;

  @Column({ name: 'IdentityLastRequest', type: 'datetime', nullable: true })
  public identityLastRequest: Date | null;

  @Column({
    name: 'BankAccountResults',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public bankAccountResults: string | null;

  @Column({ name: 'BankValidLastRequest', type: 'datetime', nullable: true })
  public bankValidLastRequest: Date | null;

  @Column({
    name: 'TaxIDValidationResults',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public taxIdValidationResults: string | null;

  @Column({ name: 'TaxIDLastRequest', type: 'datetime', nullable: true })
  public taxIdLastRequest: Date | null;

  @Column({
    name: 'KBAValidationResults',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public kbaValidationResults: string | null;

  @Column({ name: 'KBALastRequestDate', type: 'datetime', nullable: true })
  public kbaLastRequestDate: Date | null;

  @Column({
    name: 'AddressValidationResult',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public addressValidationResult: string | null;

  @Column({ name: 'AddressLastRequestDate', type: 'datetime', nullable: true })
  public addressLastRequestDate: Date | null;

  @Column({
    name: 'GeolocationResults',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public geolocationResults: string | null;

  @Column({
    name: 'GeolocationLastRequestDate',
    type: 'datetime',
    nullable: true,
  })
  public geolocationLastRequestDate: Date | null;

  @Column({
    name: 'EmailValidationResult',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public emailValidationResult: string | null;

  @Column({
    name: 'EmailValidLastRequestDate',
    type: 'datetime',
    nullable: true,
  })
  public emailValidLastRequestDate: Date | null;

  @Column({
    name: 'ReversePhoneResult',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public reversePhoneResult: string | null;

  @Column({ name: 'PhoneLastRequestDate', type: 'datetime', nullable: true })
  public phoneLastRequestDate: Date | null;

  @Column({
    name: 'TwoFactorResult',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public twoFactorResult: string | null;

  @Column({
    name: 'TwoFactorLastRequestDate',
    type: 'datetime',
    nullable: true,
  })
  public twoFactorLastRequestDate: Date | null;

  @Column({
    name: 'KYCSiteScanResult',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public kycSiteScanResult: string | null;

  @Column({ name: 'KYCLastRequestDate', type: 'datetime', nullable: true })
  public kycLastRequestDate: Date | null;

  @Column({
    name: 'FraudMonitoringResult',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public fraudMonitoringResult: string | null;

  @Column({
    name: 'FraudMntorLastRequestDate',
    type: 'datetime',
    nullable: true,
  })
  public fraudMntorLastRequestDate: Date | null;

  @Column({
    name: 'MastercardMatchResult',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public mastercardMatchResult: string | null;

  @Column({ name: 'MCMATCHLastRequestDate', type: 'datetime', nullable: true })
  public mcmatchLastRequestDate: Date | null;

  @Column({ name: 'PendDateSent', type: 'datetime', nullable: true })
  public pendDateSent: Date | null;

  @Column({ name: 'PendCompletedDate', type: 'datetime', nullable: true })
  public pendCompletedDate: Date | null;

  @Column({
    name: 'PendStatusReason',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public pendStatusReason: string | null;

  @Column({
    name: 'PendAdditionalComments',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  public pendAdditionalComments: string | null;

  @Column({ name: 'ImportedDate', type: 'datetime', nullable: true })
  public importedDate: Date | null;

  @Column({ name: 'UpdatedDate', type: 'datetime', nullable: true })
  public updatedDate: Date | null;

  @Column({ name: 'Association', type: 'varchar', length: 50, nullable: true })
  public association: string | null;

  @Column({
    name: 'RiskAssessment',
    type: 'varchar',
    length: 72,
    nullable: true,
  })
  public riskAssessment: string | null;

  @Column({ name: 'LastRequest', type: 'datetime', nullable: true })
  public lastRequest: Date | null;

  @Column({ name: 'AutoApproved', type: 'varchar', length: 4, nullable: true })
  public autoApproved: string | null;

  @Column({
    name: 'DecisionByKompliant',
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  public decisionByKompliant: string | null;

  @Column({ name: 'RiskLevelEvalDate', type: 'datetime', nullable: true })
  public riskLevelEvalDate: Date | null;

  @Column({
    name: 'RiskLevelKompliant',
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  public riskLevelKompliant: string | null;

  @Column({ name: 'StatusDateKompliant', type: 'datetime', nullable: true })
  public statusDateKompliant: Date | null;

  @Column({
    name: 'StatusKompliant',
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  public statusKompliant: string | null;
}
