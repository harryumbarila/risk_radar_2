import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tblNetSettlementTrans', schema: 'dbo' })
export class NetSettlementTrans {
  @PrimaryGeneratedColumn({ name: 'pkTrans', type: 'int' })
  public id: number;

  @Column({ name: 'fkTransGroup', type: 'int', nullable: true })
  public groupId?: number;

  @Column({ name: 'fkTransParent', type: 'int', nullable: true })
  public parentId?: number;

  @Column({ name: 'fkTransSource', type: 'int' })
  public sourceId: number;

  @Column({ name: 'fkTransSourceReferenceKey', type: 'int', nullable: true })
  public sourceReferenceKey?: number;

  @Column({ name: 'fkTransCategory', type: 'int' })
  public categoryId: number;

  @Column({ name: 'fkTransType', type: 'int' })
  public typeId: number;

  @Column({ name: 'sBankNumber', type: 'varchar', length: 4 })
  public bankNumber: string;

  @Column({ name: 'sMID6', type: 'varchar', length: 8 })
  public mid6: string;

  @Column({ name: 'sMID', type: 'varchar', length: 16 })
  public mid: string;

  @Column({ name: 'sDBA', type: 'varchar', length: 75, nullable: true })
  public dba?: string;

  @Column({ name: 'dtTrans', type: 'datetime', nullable: true })
  public transactionDate?: Date;

  @Column({
    name: 'dAmt',
    type: 'numeric',
    precision: 18,
    scale: 2,
  })
  public amount: number; // keep as string to avoid JS floating-point issues

  @Column({ name: 'sReturnCode', type: 'varchar', length: 3, nullable: true })
  public returnCode?: string;

  @Column({ name: 'dtTableLock', type: 'datetime', nullable: true })
  public tableLockAt?: Date;

  @Column({
    name: 'bHidden',
    type: 'bit',
    default: false,
  })
  public hidden: boolean;

  @Column({ name: 'dtHidden', type: 'datetime', nullable: true })
  public hiddenAt?: Date;

  @Column({ name: 'sHiddenBy', type: 'varchar', length: 25, nullable: true })
  public hiddenBy?: string;

  @CreateDateColumn({
    name: 'dtCreated',
    type: 'datetime',
    default: () => 'GETDATE()',
  })
  public createdAt: Date;

  @Column({ name: 'sCreatedBy', type: 'varchar', length: 25, nullable: true })
  public createdBy?: string;
}
