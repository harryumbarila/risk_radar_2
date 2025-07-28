import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SubscriptionQueueRequestEventJsonSource', { schema: 'Iris.dbo' })
export class SubscriptionQueueRequestEventJsonSourceEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  public id: number;

  @Column({
    name: 'SubscriptionQueue_LastRequestIdProcessed',
    type: 'bigint',
    nullable: false,
  })
  public lastRequestIdProcessed: number;

  @Column({
    name: 'SubscriptionQueue_LastRequestIdProcessedForStatusChange',
    type: 'bigint',
    nullable: true,
  })
  public lastRequestIdProcessedForStatusChange: number | null;

  @Column({
    name: 'SubscriptionQueue_LastRequestIdProcessedForMPAUpload',
    type: 'bigint',
    nullable: true,
  })
  public lastRequestIdProcessedForMPAUpload: number | null;

  @Column({ name: 'IrisLeadId', type: 'bigint', nullable: true })
  public irisLeadId: number | null;

  @Column({ name: 'IrisMId', type: 'varchar', length: 20, nullable: true })
  public irisMId: string | null;

  @Column({
    name: 'dtTurboAppApproved',
    type: 'datetimeoffset',
    nullable: true,
  })
  public turboAppApprovedDate: Date | null;

  @Column({
    name: 'dtTurboAppApprovedCapturedInTalusDB',
    type: 'datetime',
    nullable: true,
  })
  public turboAppApprovedCapturedInTalusDBDate: Date | null;

  @Column({ name: 'dtIrisCreated', type: 'datetimeoffset', nullable: true })
  public irisCreatedDate: Date | null;

  @Column({ name: 'dtIrisModified', type: 'datetimeoffset', nullable: true })
  public irisModifiedDate: Date | null;

  @Column({ name: 'sCategory', type: 'varchar', length: 50, nullable: true })
  public category: string | null;

  @Column({ name: 'sStatus', type: 'varchar', length: 50, nullable: true })
  public status: string | null;

  @Column({ name: 'sBI_MCC', type: 'varchar', length: 10, nullable: true })
  public biMcc: string | null;

  @Column({
    name: 'sUW_NewAccountHold',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  public uwNewAccountHold: string | null;

  @Column({ name: 'sUW_MCC', type: 'varchar', length: 10, nullable: true })
  public uwMcc: string | null;

  @Column({
    name: 'sPE_TalusPayApp',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  public peTalusPayApp: string | null;

  @Column({
    name: 'sRI_MerchantApplType',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public riMerchantApplType: string | null;

  @Column({
    name: 'dtSignedMPAUploadedToIris',
    type: 'datetimeoffset',
    nullable: true,
  })
  public signedMPAUploadedToIrisDate: Date | null;

  @Column({
    name: 'dtSignedMPACapturedInTalusDB',
    type: 'datetime',
    nullable: true,
  })
  public signedMPACapturedInTalusDBDate: Date | null;

  @Column({ name: 'dtAutoApproved', type: 'datetime', nullable: true })
  public autoApprovedDate: Date | null;

  @Column({
    name: 'dtUW_NewAccountHold_OnDivertCapturedInTalusDB',
    type: 'datetime',
    nullable: true,
  })
  public uwNewAccountHoldOnDivertCapturedInTalusDBDate?: Date;

  @Column({
    name: 'dtUW_NewAccountHold_OffDivertCapturedInTalusDB',
    type: 'datetime',
    nullable: true,
  })
  public uwNewAccountHoldOffDivertCapturedInTalusDBDate?: Date | null;

  @Column({
    name: 'sOW_AllOwnersSigned',
    type: 'varchar',
    length: 5,
    nullable: true,
  })
  public owAllOwnersSigned: string | null;

  @Column({ name: 'bDeleted', type: 'bit', nullable: false })
  public isDeleted: boolean;

  @Column({ name: 'bException', type: 'bit', nullable: false })
  public isException: boolean;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdDate: Date;

  @Column({ name: 'dtLastUpdated', type: 'datetime', nullable: true })
  public lastUpdatedDate: Date | null;
}
