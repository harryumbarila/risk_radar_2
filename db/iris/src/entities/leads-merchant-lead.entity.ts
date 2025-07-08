import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LeadsMerchantLead', schema: 'Iris.dbo' })
export class LeadsMerchantLead {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'Id' })
  public id: number;

  @Column('bigint', { name: 'LeadId', nullable: true })
  public leadId?: number;

  @Column('varchar', {
    length: 100,
    name: 'PrimarySalesPerson',
    nullable: true,
  })
  public primarySalesPerson?: string;

  @Column('varchar', { length: 100, name: 'DBAName', nullable: true })
  public dbaName?: string;

  @Column('varchar', { length: 75, name: 'DBAAddress', nullable: true })
  public dbaAddress?: string;

  @Column('varchar', { length: 75, name: 'SuiteNumber', nullable: true })
  public suiteNumber?: string;

  @Column('varchar', { length: 50, name: 'DBACity', nullable: true })
  public dbaCity?: string;

  @Column('varchar', { length: 100, name: 'DBAState', nullable: true })
  public dbaState?: string;

  @Column('varchar', { length: 25, name: 'DBAZIP', nullable: true })
  public dbaZip?: string;

  @Column('varchar', { length: 100, name: 'ContactName', nullable: true })
  public contactName?: string;

  @Column('varchar', { length: 20, name: 'DBAPhoneNo', nullable: true })
  public dbaPhoneNo?: string;

  @Column('varchar', { length: 100, name: 'PartnerRep', nullable: true })
  public partnerRep?: string;

  @Column('varchar', { length: 20, name: 'PartnerRepPhone', nullable: true })
  public partnerRepPhone?: string;

  @Column('varchar', { length: 50, name: 'PartnerRepEmail', nullable: true })
  public partnerRepEmail?: string;

  @Column('varchar', {
    length: 100,
    name: 'PartnerBranchOrOffice',
    nullable: true,
  })
  public partnerBranchOrOffice?: string;

  @Column('varchar', {
    length: 100,
    name: 'TMOOrTreasuryOfficer',
    nullable: true,
  })
  public tmoOrTreasuryOfficer?: string;

  @Column('varchar', { length: 100, name: 'CampaignName', nullable: true })
  public campaignName?: string;

  @Column('varchar', { length: 100, name: 'NoLocations', nullable: true })
  public noLocations?: string;

  @Column('varchar', { length: 100, name: 'CurrentEquipment', nullable: true })
  public currentEquipment?: string;

  @Column('varchar', {
    length: 100,
    name: 'CurrentProcessingCmpny',
    nullable: true,
  })
  public currentProcessingCmpny?: string;

  @Column('varchar', { length: 100, name: 'KeyPainPoint', nullable: true })
  public keyPainPoint?: string;

  @Column('varchar', { length: 100, name: 'LostReason', nullable: true })
  public lostReason?: string;

  @Column('varchar', { length: 600, name: 'Comments', nullable: true })
  public comments?: string;

  @Column('varchar', {
    length: 100,
    name: 'SubscriptionFeeMethod',
    nullable: true,
  })
  public subscriptionFeeMethod?: string;

  @Column('varchar', { length: 100, name: 'PRMonth', nullable: true })
  public prMonth?: string;

  @Column('varchar', {
    length: 300,
    name: 'PRToolBoardingNotes',
    nullable: true,
  })
  public prToolBoardingNotes?: string;

  @Column('varchar', { length: 75, name: 'ContactEmail', nullable: true })
  public contactEmail?: string;

  @Column('varchar', {
    length: 100,
    name: 'AMEXSalesFeesSetting',
    nullable: true,
  })
  public amexSalesFeesSetting?: string;

  @Column('varchar', {
    length: 50,
    name: 'TalusLegacyAgentName',
    nullable: true,
  })
  public talusLegacyAgentName?: string;

  @Column('varchar', { length: 50, name: 'SalesforceID', nullable: true })
  public salesforceId?: string;

  @Column('varchar', { length: 50, name: 'ContactTitle', nullable: true })
  public contactTitle?: string;

  @Column('varchar', { length: 100, name: 'PrimaryLanguage', nullable: true })
  public primaryLanguage?: string;

  @Column('varchar', {
    length: 100,
    name: 'SpecialRelationship',
    nullable: true,
  })
  public specialRelationship?: string;

  @Column('varchar', {
    length: 50,
    name: 'MarketingEmailOptOut',
    nullable: true,
  })
  public marketingEmailOptOut?: string;

  @Column('varchar', { length: 10, name: 'StatementsReceived', nullable: true })
  public statementsReceived?: string;

  @Column('varchar', {
    length: 10,
    name: 'ConsultationScheduled',
    nullable: true,
  })
  public consultationScheduled?: string;

  @Column('varchar', { length: 25, name: 'DoNotCall', nullable: true })
  public doNotCall?: string;

  @Column('varchar', {
    length: 10,
    name: 'ConsultationCompleted',
    nullable: true,
  })
  public consultationCompleted?: string;

  @Column('varchar', { length: 200, name: 'InvoiceEmail', nullable: true })
  public invoiceEmails?: string;

  @Column('varchar', {
    length: 100,
    name: 'SolutionConsultant',
    nullable: true,
  })
  public solutionConsultant?: string;

  @Column('varchar', { length: 100, name: 'ReferalPartner', nullable: true })
  public referralPartner?: string;

  @Column('varchar', { length: 100, name: 'Reseller', nullable: true })
  public reseller?: string;

  @Column('varchar', { length: 100, name: 'ISV', nullable: true })
  public isv?: string;

  @Column('datetime', { name: 'ExpectedWinDate', nullable: true })
  public expectedWinDate?: Date;

  @Column('datetime', { name: 'Dateof1stMMFInvoice', nullable: true })
  public dateOf1stMMFInvoice?: Date;

  @Column('datetime', {
    name: 'ImportedDate',
    nullable: true,
    default: () => 'GETDATE()',
  })
  public importedDate?: Date;

  @Column('datetime', { name: 'UpdatedDate', nullable: true })
  public updatedDate?: Date;

  @Column('datetime', { name: 'ConsultationDate', nullable: true })
  public consultationDate?: Date;

  @Column('decimal', {
    name: 'EstAnnualProfit',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public estAnnualProfit?: string;

  @Column('decimal', {
    name: 'EstAnnualPartnerComm',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public estAnnualPartnerComm?: string;

  @Column('decimal', {
    name: 'EstAnnualSCCommission',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public estAnnualScCommission?: string;

  @Column('decimal', {
    name: 'EstAnnualVolume',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public estAnnualVolume?: string;

  @Column('decimal', {
    name: 'AverageTicket',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public averageTicket?: string;

  @Column('decimal', {
    name: 'PreviousEffectiveRate',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public previousEffectiveRate?: string;

  @Column('decimal', {
    name: 'EstEffectiveRate',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public estEffectiveRate?: string;

  @Column('decimal', {
    name: 'EstAnnualSavingsDollar',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public estAnnualSavingsDollar?: string;

  @Column('decimal', {
    name: 'EstAnnualSavingsPercent',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public estAnnualSavingsPercent?: string;

  @Column('decimal', {
    name: 'SubscriptionFee',
    nullable: true,
    precision: 20,
    scale: 4,
  })
  public subscriptionFee?: string;

  @Column('decimal', {
    name: 'SubscriptionFeeDollar',
    nullable: true,
    precision: 18,
    scale: 4,
  })
  public subscriptionFeeDollar?: string;

  @Column('bit', { name: 'ProcessingWithOtherCompany', nullable: true })
  public processingWithOtherCompany!: boolean | null;

  @Column('bit', { name: 'AHVAccount', nullable: true })
  public ahvAccount!: boolean | null;

  @Column('bit', { name: 'SalesSupportAssisted', nullable: true })
  public salesSupportAssisted!: boolean | null;

  @Column('bit', { name: 'DontBill$10Minimum', nullable: true })
  public dontBill10Minimum!: boolean | null;
}
