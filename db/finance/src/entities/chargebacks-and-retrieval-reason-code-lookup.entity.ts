import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblChargeBacksAndRetrievalReasonCode_LookUp')
export class ChargebacksAndRetrievalReasonCodeLookupEntity {
  @PrimaryGeneratedColumn({ name: 'pkReasonCode' })
  public id: number;

  @Column({ name: 'sReasonCode', type: 'varchar', length: 5, nullable: true })
  public reasonCode: string;

  @Column({
    name: 'sDescription',
    type: 'varchar',
    length: 350,
    nullable: true,
  })
  public description: string;

  @Column({ name: 'sCardType', type: 'varchar', length: 2, nullable: true })
  public cardType: string;

  @Column({
    name: 'dtCreated',
    type: 'datetime',
    nullable: false,
    default: () => 'GETDATE()',
  })
  public createdAt: Date;

  @Column({
    name: 'bExclusiveChargeBackReason',
    type: 'bit',
    nullable: true,
    default: null,
  })
  public isExclusiveChargeBackReason: boolean;

  @Column({
    name: 'bExclusiveRetrievalReason',
    type: 'bit',
    nullable: true,
    default: null,
  })
  public isExclusiveRetrievalReason: boolean;
}
