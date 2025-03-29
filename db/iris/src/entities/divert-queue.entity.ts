import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('DivertQueue', { schema: 'RiskRadar', database: 'Iris' })
export class DivertQueueEntity {
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

  @Column({ name: 'UpdateDate', type: 'datetime', nullable: true })
  public updateDate: Date;

  @Column({ name: 'IrisUpdateDate', type: 'datetime', nullable: true })
  public irisUpdateDate: Date;

  @Column({ name: 'CreatedBy', type: 'varchar', length: 75, nullable: true })
  public createdBy: string;

  @Column({ name: 'UpdatedBy', type: 'varchar', length: 75, nullable: true })
  public updatedBy: string;

  @Column({
    name: 'UpdateMessage',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  public updateMessage: string;

  @Column({ name: 'IsProcess', type: 'bit', nullable: true })
  public isProcessed: boolean;

  @Column({ name: 'RFBMFileCreatedDate', type: 'datetime', nullable: true })
  public rfbmFileCreatedDate: Date;
}
