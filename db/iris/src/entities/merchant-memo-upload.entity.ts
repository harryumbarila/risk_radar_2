import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'MerchantMemoUpload', schema: 'dbo' })
export class MerchantMemoUpload {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'IrisMId', type: 'varchar', length: 20, nullable: true })
  public irisMerchantId?: string;

  @Column({ name: 'IrisLeadId', type: 'bigint', nullable: true })
  public irisLeadId?: number;

  @Column({ name: 'Memo', type: 'nvarchar', nullable: true })
  public memo?: string;

  @Column({ name: 'IsProcessed', type: 'bit', nullable: true })
  public isProcessed?: boolean;

  @Column({ name: 'IsVisible', type: 'bit', nullable: true })
  public isVisible?: boolean;

  @Column({ name: 'Error', type: 'nvarchar', nullable: true })
  public error?: string;

  @Column({ name: 'CreatedDT', type: 'datetime', nullable: true })
  public createdAt?: Date;

  @Column({ name: 'dtIrisUpdated', type: 'datetime', nullable: true })
  public irisUpdatedAt?: Date;
}
