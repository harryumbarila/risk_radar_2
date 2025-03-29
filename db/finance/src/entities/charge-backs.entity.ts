import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblChargeBacks', { schema: 'Finance.dbo' })
export class ChargeBacksEntity {
  @PrimaryGeneratedColumn({ name: 'pkChargeBacks' })
  id: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  mid: string | null;

  @Column({ name: 'sDBA', type: 'varchar', length: 50, nullable: true })
  dba: string | null;

  @Column({ name: 'dAmt', type: 'decimal', precision: 18, scale: 2, nullable: true })
  amount: number | null;

  @Column({ name: 'dtTrans', type: 'datetime', nullable: true })
  transactionDate: Date | null;

  @Column({ name: 'sCardNum', type: 'varchar', length: 25, nullable: true })
  cardNumber: string | null;

  @Column({ name: 'dtReceived', type: 'datetime', nullable: true })
  receivedDate: Date | null;

  @Column({ name: 'sReferenceNum', type: 'varchar', length: 20, nullable: true })
  referenceNumber: string | null;

  @Column({ name: 'sReasonCode', type: 'varchar', length: 10, nullable: true })
  reasonCode: string | null;

  @Column({ name: 'sType', type: 'varchar', length: 15, nullable: true })
  type: string | null;

  @Column({ name: 'sCaseNumber', type: 'varchar', length: 25, nullable: true })
  caseNumber: string | null;

  @Column({ name: 'fkACHDetail_Fee', type: 'int', nullable: true })
  achDetailFeeId: number | null;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  createdDate: Date;

  @Column({ name: 'sPaymentType', type: 'varchar', length: 5, nullable: true })
  paymentType: string | null;

  @Column({ name: 'sAssNum', type: 'varchar', length: 6, nullable: true })
  assNumber: string | null;

  @Column({ name: 'dtP2PortalChargeback', type: 'datetime', nullable: true })
  p2PortalChargebackDate: Date | null;

  @Column({ name: 'fkChgbkAndRetrievalNew', type: 'int', nullable: true })
  chargebackAndRetrievalNewId: number | null;

  @Column({ name: 'sPaymentType2', type: 'varchar', length: 5, nullable: true })
  paymentType2: string | null;

  @Column({ name: 'fkMerlinCaseAction', type: 'int', nullable: true })
  merlinCaseActionId: number | null;
} 