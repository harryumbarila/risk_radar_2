import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tblNetSettlementMIDLabel' })
export class NetSettlementMidLabel {
  @PrimaryGeneratedColumn({ name: 'pkNetSettlementMIDLabel' })
  public id: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16 })
  public merchantId: string;

  @Column({ name: 'fkNetSettlementLabelType', type: 'int', nullable: true })
  public labelTypeId?: number;

  @Column({ name: 'sCreatedBy', type: 'varchar', length: 25, nullable: true })
  public createdBy?: string;

  @CreateDateColumn({
    name: 'dtCreated',
    type: 'datetime',
    default: () => 'GETDATE()',
  })
  public createdAt: Date;

  @Column({
    name: 'sLastUpdatedBy',
    type: 'varchar',
    length: 25,
    nullable: true,
  })
  public lastUpdatedBy?: string;

  @Column({ name: 'dtLastUpdated', type: 'datetime', nullable: true })
  public updatedAt?: Date;
}
