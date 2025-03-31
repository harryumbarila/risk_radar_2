import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('LeadsFinancialProfile', { schema: 'Iris.dbo' })
export class LeadsFinancialProfileEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Column({ name: 'LeadId', type: 'bigint', nullable: true })
  public leadId: number | null;

  @Column({
    name: 'AmexAverageTicket',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public amexAverageTicket: number | null;

  @Column({
    name: 'AmexAvgMonthlyVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public amexAvgMonthlyVolume: number | null;

  @Column({ name: 'LawsuitsPending', type: 'bit', nullable: true })
  public lawsuitsPending: boolean | null;

  @Column({ name: 'IsBusinessForSale', type: 'bit', nullable: true })
  public isBusinessForSale: boolean | null;

  @Column({
    name: 'StoreFrontSwiped',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public storeFrontSwiped: number | null;

  @Column({
    name: 'Internet',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public internet: number | null;

  @Column({
    name: 'MOTOMailTelephoneOrder',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public motoMailTelephoneOrder: number | null;

  @Column({
    name: 'Keyed',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public keyed: number | null;

  @Column({
    name: 'VMCDAvgMonthlyVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public vmcdAvgMonthlyVolume: number | null;

  @Column({
    name: 'VMCDAverageTicket',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public vmcdAverageTicket: number | null;

  @Column({
    name: 'HighTicket',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public highTicket: number | null;

  @Column({ name: 'SeasonalMerchant', type: 'bit', nullable: true })
  public seasonalMerchant: boolean | null;

  @Column({
    name: 'IfYesHighVolMonths',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public ifYesHighVolMonths: string | null;

  @Column({ name: 'January', type: 'bit', nullable: true })
  public january: boolean | null;

  @Column({ name: 'February', type: 'bit', nullable: true })
  public february: boolean | null;

  @Column({ name: 'March', type: 'bit', nullable: true })
  public march: boolean | null;

  @Column({ name: 'April', type: 'bit', nullable: true })
  public april: boolean | null;

  @Column({ name: 'May', type: 'bit', nullable: true })
  public may: boolean | null;

  @Column({ name: 'June', type: 'bit', nullable: true })
  public june: boolean | null;

  @Column({ name: 'July', type: 'bit', nullable: true })
  public july: boolean | null;

  @Column({ name: 'August', type: 'bit', nullable: true })
  public august: boolean | null;

  @Column({ name: 'September', type: 'bit', nullable: true })
  public september: boolean | null;

  @Column({ name: 'October', type: 'bit', nullable: true })
  public october: boolean | null;

  @Column({ name: 'November', type: 'bit', nullable: true })
  public november: boolean | null;

  @Column({ name: 'December', type: 'bit', nullable: true })
  public december: boolean | null;

  @Column({
    name: 'SeasonalVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public seasonalVolume: number | null;

  @Column({
    name: 'CreditBankName',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public creditBankName: string | null;

  @Column({
    name: 'CreditRoutingNumber',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public creditRoutingNumber: string | null;

  @Column({
    name: 'CreditAccountType',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public creditAccountType: string | null;

  @Column({
    name: 'NameOnCreditAccount',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public nameOnCreditAccount: string | null;

  @Column({
    name: 'DebitRoutingNumber',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public debitRoutingNumber: string | null;

  @Column({
    name: 'DebitBankName',
    type: 'varchar',
    length: 75,
    nullable: true,
  })
  public debitBankName: string | null;

  @Column({
    name: 'DebitAccountType',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public debitAccountType: string | null;

  @Column({ name: 'BankContact', type: 'varchar', length: 100, nullable: true })
  public bankContact: string | null;

  @Column({ name: 'PriorBankruptcy', type: 'bit', nullable: true })
  public priorBankruptcy: boolean | null;

  @Column({
    name: 'IfYesWhatDate',
    type: 'varchar',
    length: 75,
    nullable: true,
  })
  public ifYesWhatDate: string | null;

  @Column({ name: 'BusinessBankruptcy', type: 'bit', nullable: true })
  public businessBankruptcy: boolean | null;

  @Column({ name: 'PersonalBackruptcy', type: 'bit', nullable: true })
  public personalBackruptcy: boolean | null;

  @Column({
    name: 'AnnualAmexVolume',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public annualAmexVolume: string | null;

  @Column({ name: 'Comments', type: 'varchar', length: 255, nullable: true })
  public comments: string | null;

  @Column({ name: 'ImportedDate', type: 'datetime', nullable: true })
  public importedDate: Date | null;

  @Column({ name: 'UpdatedDate', type: 'datetime', nullable: true })
  public updatedDate: Date | null;

  @Column({
    name: 'DiscountMethod',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public discountMethod: string | null;

  @Column({
    name: 'CreditAccountOwnership',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public creditAccountOwnership: string | null;

  @Column({
    name: 'NameOnDebitAccount',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public nameOnDebitAccount: string | null;

  @Column({
    name: 'DebitAccountOwnership',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public debitAccountOwnership: string | null;

  @Column({
    name: 'AnnualCashCreditVol',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public annualCashCreditVol: string | null;

  @Column({ name: 'CreditDDANumber', type: 'varbinary', nullable: true })
  public creditDdaNumber: Buffer | null;

  @Column({ name: 'ConfirmCreditDDANumber', type: 'varbinary', nullable: true })
  public confirmCreditDdaNumber: Buffer | null;

  @Column({ name: 'DebitDDANumber', type: 'varbinary', nullable: true })
  public debitDdaNumber: Buffer | null;

  @Column({ name: 'ConfirmDebitDDANumber', type: 'varbinary', nullable: true })
  public confirmDebitDdaNumber: Buffer | null;

  @Column({
    name: 'NextDayFunding',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public nextDayFunding: string | null;

  @Column({
    name: 'AnnualMCVisaVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public annualMcVisaVolume: number | null;

  @Column({
    name: 'AnnualDiscoverPPVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public annualDiscoverPpVolume: number | null;

  @Column({
    name: 'AnnualWEXVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public annualWexVolume: number | null;

  @Column({
    name: 'AnnualVoyagerVolume',
    type: 'decimal',
    precision: 20,
    scale: 4,
    nullable: true,
  })
  public annualVoyagerVolume: number | null;

  @Column({ name: 'Yes', type: 'bit', nullable: true })
  public yes: boolean | null;

  @Column({ name: 'No', type: 'bit', nullable: true })
  public no: boolean | null;

  @Column({
    name: 'DebitBankContact',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public debitBankContact: string | null;
}
