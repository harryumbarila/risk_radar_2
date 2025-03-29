import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('LeadsServices', { schema: 'Iris.dbo' })
export class LeadsServicesEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Column({ name: 'LeadId', type: 'bigint', nullable: true })
  public leadId: number | null;

  @Column({ name: 'MastercardCredit', type: 'bit', nullable: true })
  public mastercardCredit: boolean | null;

  @Column({ name: 'MastercardDebit', type: 'bit', nullable: true })
  public mastercardDebit: boolean | null;

  @Column({ name: 'VisaCredit', type: 'bit', nullable: true })
  public visaCredit: boolean | null;

  @Column({ name: 'VisaDebit', type: 'bit', nullable: true })
  public visaDebit: boolean | null;

  @Column({ name: 'DiscoverCredit', type: 'bit', nullable: true })
  public discoverCredit: boolean | null;

  @Column({ name: 'DiscoverDebit', type: 'bit', nullable: true })
  public discoverDebit: boolean | null;

  @Column({ name: 'DiscoverDirectNumber', type: 'varchar', length: 45, nullable: true })
  public discoverDirectNumber: string | null;

  @Column({ name: 'AmexESANumber', type: 'varchar', length: 30, nullable: true })
  public amexEsaNumber: string | null;

  @Column({ name: 'PINDebit', type: 'bit', nullable: true })
  public pinDebit: boolean | null;

  @Column({ name: 'WEXFullAcquiring', type: 'bit', nullable: true })
  public wexFullAcquiring: boolean | null;

  @Column({ name: 'EBTFoodStamps', type: 'bit', nullable: true })
  public ebtFoodStamps: boolean | null;

  @Column({ name: 'EBTCashBenefits', type: 'bit', nullable: true })
  public ebtCashBenefits: boolean | null;

  @Column({ name: 'FNSNumber', type: 'varchar', length: 50, nullable: true })
  public fnsNumber: string | null;

  @Column({ name: 'FCSNumber', type: 'varchar', length: 50, nullable: true })
  public fcsNumber: string | null;

  @Column({ name: 'GiftCard', type: 'varchar', length: 100, nullable: true })
  public giftCard: string | null;

  @Column({ name: 'CheckServices', type: 'varchar', length: 100, nullable: true })
  public checkServices: string | null;

  @Column({ name: 'MerchantCashAdvance', type: 'varchar', length: 100, nullable: true })
  public merchantCashAdvance: string | null;

  @Column({ name: 'MerchantCashAdvancePercentage', type: 'decimal', precision: 20, scale: 4, nullable: true })
  public merchantCashAdvancePercentage: number | null;

  @Column({ name: 'MerchantCashAdvanceAmount', type: 'decimal', precision: 20, scale: 4, nullable: true })
  public merchantCashAdvanceAmount: number | null;

  @Column({ name: 'ZupplerHidden', type: 'bit', nullable: true })
  public zupplerHidden: boolean | null;

  @Column({ name: 'BuyNowPayLaterHidden', type: 'varchar', length: 100, nullable: true })
  public buyNowPayLaterHidden: string | null;

  @Column({ name: 'ImportedDate', type: 'datetime', nullable: true })
  public importedDate: Date | null;

  @Column({ name: 'UpdatedDate', type: 'datetime', nullable: true })
  public updatedDate: Date | null;

  @Column({ name: 'AmericanExpress', type: 'varchar', length: 100, nullable: true })
  public americanExpress: string | null;

  @Column({ name: 'Discover', type: 'varchar', length: 100, nullable: true })
  public discover: string | null;

  @Column({ name: 'PMBOrRHHealth', type: 'bit', nullable: true })
  public pmbOrRhHealth: boolean | null;

  @Column({ name: 'Voyager', type: 'bit', nullable: true })
  public voyager: boolean | null;

  @Column({ name: 'WEXNonFullAcquiring', type: 'bit', nullable: true })
  public wexNonFullAcquiring: boolean | null;

  @Column({ name: 'AliPay', type: 'bit', nullable: true })
  public aliPay: boolean | null;

  @Column({ name: 'PayPal', type: 'bit', nullable: true })
  public payPal: boolean | null;

  @Column({ name: 'OneTimeEquipmentFee', type: 'decimal', precision: 6, scale: 2, nullable: true })
  public oneTimeEquipmentFee: number | null;

  @Column({ name: 'ACHAndCheckServices', type: 'bit', nullable: true })
  public achAndCheckServices: boolean | null;

  @Column({ name: 'GiftCardCB', type: 'bit', nullable: true })
  public giftCardCb: boolean | null;

  @Column({ name: 'MerchantCashAdvanceCB', type: 'bit', nullable: true })
  public merchantCashAdvanceCb: boolean | null;

  @Column({ name: 'TalusPayApp', type: 'bit', nullable: true })
  public talusPayApp: boolean | null;

  @Column({ name: 'FluidpayPartner', type: 'varchar', length: 100, nullable: true })
  public fluidpayPartner: string | null;
} 