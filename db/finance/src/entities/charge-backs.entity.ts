import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblChargeBacks', { schema: 'Finance.dbo' })
export class ChargeBacksEntity {
  @PrimaryGeneratedColumn({ name: 'pkChargeBacks' })
  public id: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public mid: string | null;

  @Column({ name: 'sDBA', type: 'varchar', length: 50, nullable: true })
  public dba: string | null;

  @Column({
    name: 'dAmt',
    type: 'decimal',
    precision: 18,
    scale: 2,
    nullable: true,
  })
  public amount: number | null;

  @Column({ name: 'dtTrans', type: 'datetime', nullable: true })
  public transactionDate: Date | null;

  @Column({ name: 'sCardNum', type: 'varchar', length: 25, nullable: true })
  public cardNumber: string | null;

  @Column({ name: 'dtReceived', type: 'datetime', nullable: true })
  public receivedDate: Date | null;

  @Column({
    name: 'sReferenceNum',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public referenceNumber: string | null;

  @Column({ name: 'sReasonCode', type: 'varchar', length: 10, nullable: true })
  public reasonCode: string | null;

  @Column({ name: 'sType', type: 'varchar', length: 15, nullable: true })
  public type: string | null;

  @Column({ name: 'sCaseNumber', type: 'varchar', length: 25, nullable: true })
  public caseNumber: string | null;

  @Column({ name: 'fkACHDetail_Fee', type: 'int', nullable: true })
  public achDetailFeeId: number | null;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdDate: Date;

  @Column({ name: 'sPaymentType', type: 'varchar', length: 5, nullable: true })
  public paymentType: string | null;

  @Column({ name: 'sAssNum', type: 'varchar', length: 6, nullable: true })
  public assNumber: string | null;

  @Column({ name: 'dtP2PortalChargeback', type: 'datetime', nullable: true })
  public p2PortalChargebackDate: Date | null;

  @Column({ name: 'fkChgbkAndRetrievalNew', type: 'int', nullable: true })
  public chargebackAndRetrievalNewId: number | null;

  @Column({ name: 'sPaymentType2', type: 'varchar', length: 5, nullable: true })
  public paymentType2: string | null;

  @Column({ name: 'fkMerlinCaseAction', type: 'int', nullable: true })
  public merlinCaseActionId: number | null;
}
