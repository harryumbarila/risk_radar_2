import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tblNetSettlementTransWorkSheet', schema: 'dbo' })
export class NetSettlementTransWorkSheet {
  @PrimaryGeneratedColumn({ name: 'pkTransWorkSheet' })
  public id: number;

  @Column({ name: 'fkTrans', nullable: true })
  public transactionId?: number;

  @Column({ name: 'fkTrans_Reference', nullable: true })
  public referenceTransactionId?: number;

  @Column({ name: 'fkTransCategory' })
  public transactionCategoryId: number;

  @Column({ name: 'fkTransType' })
  public transactionTypeId: number;

  @Column({ name: 'fkTransDivertReason', nullable: true })
  public divertReasonId?: number;

  @Column({ name: 'dtTrans', type: 'datetime', nullable: true })
  public transactionDate?: Date;

  @Column({ name: 'dAmt', type: 'decimal', precision: 18, scale: 2 })
  public amount: number;

  @Column({ name: 'sNotes', type: 'varchar', length: 300, nullable: true })
  public notes?: string;

  @Column({ name: 'fkACHDetail1', nullable: true })
  public achDetail1Id?: number;

  @Column({ name: 'dtACHSent1', type: 'datetime', nullable: true })
  public achSentDate1?: Date;

  @Column({ name: 'fkReturnedTransaction1', nullable: true })
  public returnedTransaction1Id?: number;

  @Column({ name: 'dtACHReturned1', type: 'datetime', nullable: true })
  public achReturnedDate1?: Date;

  @Column({ name: 'sReturnCode1', type: 'varchar', length: 3, nullable: true })
  public returnCode1?: string;

  @Column({ name: 'fkACHDetail2', nullable: true })
  public achDetail2Id?: number;

  @Column({ name: 'dtACHSent2', type: 'datetime', nullable: true })
  public achSentDate2?: Date;

  @Column({ name: 'fkReturnedTransaction2', nullable: true })
  public returnedTransaction2Id?: number;

  @Column({ name: 'dtACHReturned2', type: 'datetime', nullable: true })
  public achReturnedDate2?: Date;

  @Column({ name: 'sReturnCode2', type: 'varchar', length: 3, nullable: true })
  public returnCode2?: string;

  @Column({ name: 'fkACHDetail3', nullable: true })
  public achDetail3Id?: number;

  @Column({ name: 'dtACHSent3', type: 'datetime', nullable: true })
  public achSentDate3?: Date;

  @Column({ name: 'fkReturnedTransaction3', nullable: true })
  public returnedTransaction3Id?: number;

  @Column({ name: 'dtACHReturned3', type: 'datetime', nullable: true })
  public achReturnedDate3?: Date;

  @Column({ name: 'sReturnCode3', type: 'varchar', length: 3, nullable: true })
  public returnCode3?: string;

  @Column({ name: 'dtACHStopRequested', type: 'datetime', nullable: true })
  public achStopRequestedDate?: Date;

  @Column({
    name: 'sACHStopRequestedBy',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public achStopRequestedBy?: string;

  @Column({ name: 'bACHVoided', type: 'bit', default: false })
  public isAchVoided: boolean;

  @Column({ name: 'dtACHVoided', type: 'datetime', nullable: true })
  public achVoidedDate?: Date;

  @Column({ name: 'sACHVoidedBy', type: 'varchar', length: 25, nullable: true })
  public achVoidedBy?: string;

  @Column({ name: 'dtUnCollected', type: 'datetime', nullable: true })
  public uncollectedDate?: Date;

  @Column({ name: 'fkDivertNotes_TempField', nullable: true })
  public divertNotesTempId?: number;

  @Column({ name: 'bMain', type: 'bit', default: false })
  public isMain: boolean;

  @Column({ name: 'bHidden', type: 'bit', default: false })
  public isHidden: boolean;

  @Column({ name: 'dtHidden', type: 'datetime', nullable: true })
  public hiddenDate?: Date;

  @Column({ name: 'sHiddenBy', type: 'varchar', length: 25, nullable: true })
  public hiddenBy?: string;

  @CreateDateColumn({
    name: 'dtCreated',
    type: 'datetime',
    default: () => 'GETDATE()',
  })
  public createdDate: Date;

  @Column({ name: 'sCreatedBy', type: 'varchar', length: 25 })
  public createdBy: string;
}
