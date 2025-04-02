import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DivertQueueFSP', { schema: 'RiskRadar', database: 'Iris' })
export class DivertQueueFSPEntity {
  @PrimaryGeneratedColumn({ name: 'Id', type: 'bigint' })
  public id: number;

  @Column({ name: 'MerchantId', type: 'bigint', nullable: true })
  public merchantId: number;

  @Column({ name: 'DivertFlag', type: 'bit', nullable: true })
  public isDiverted: boolean;

  @Column({
    name: 'DivertFlagNotes',
    type: 'varchar',
    length: 125,
    nullable: true,
  })
  public divertFlagNotes: string;

  @Column({ name: 'CreateDate', type: 'datetime', nullable: true })
  public createDate: Date;

  @Column({ name: 'CreatedBy', type: 'varchar', length: 75, nullable: true })
  public createdBy: string;

  @Column({ name: 'FSPUpdateResponse', type: 'varchar', nullable: true })
  public fspUpdateResponse: string;

  @Column({ name: 'FSPUpdateDate', type: 'datetime', nullable: true })
  public fspUpdateDate: Date;

  @Column({ name: 'IrisMemo', type: 'varchar', length: 500, nullable: true })
  public irisMemo: string;

  @Column({ name: 'IrisMemoUpdateDate', type: 'datetime', nullable: true })
  public irisMemoUpdateDate: Date;

  @Column({ name: 'IsSuccess', type: 'bit', nullable: true })
  public isSuccess: boolean;
}
