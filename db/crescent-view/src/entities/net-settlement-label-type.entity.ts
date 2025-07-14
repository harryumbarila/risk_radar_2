import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tblNetSettlementLabelType', schema: 'dbo' })
export class NetSettlementLabelType {
  @PrimaryGeneratedColumn({ name: 'pkNetSettlementLabelType' })
  public id: number;

  @Column({ name: 'sNetSettlementLabelType', length: 50 })
  public name: string;

  @Column({ name: 'bHidden', default: false })
  public hidden: boolean;

  @CreateDateColumn({
    name: 'dtCreated',
    type: 'datetime',
    default: () => 'GETDATE()',
  })
  public createdAt: Date;
}
