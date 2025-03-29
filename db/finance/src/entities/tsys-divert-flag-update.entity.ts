import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblTSYSDivertFlagUpdate', { schema: 'dbo', database: 'Finance' })
export class TSYSDivertFlagUpdateEntity {
  @PrimaryGeneratedColumn({ name: 'pkTSYSDivertFlagUpdate' })
  public id: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: false })
  public mid: string;

  @Column({ name: 'dtAdd', type: 'datetime', nullable: true })
  public addDate: Date;

  @Column({ name: 'dtTSYSAddSoftReserve', type: 'datetime', nullable: true })
  public tsysAddSoftReserveDate: Date;

  @Column({ name: 'dtTSYSAdded', type: 'datetime', nullable: true })
  public tsysAddedDate: Date;

  @Column({ name: 'dtRemove', type: 'datetime', nullable: true })
  public removeDate: Date;

  @Column({ name: 'dtTSYSRemovSoftReserve', type: 'datetime', nullable: true })
  public tsysRemoveSoftReserveDate: Date;

  @Column({ name: 'dtTSYSRemoved', type: 'datetime', nullable: true })
  public tsysRemovedDate: Date;

  @Column({ name: 'dtTSYSRemovedManually', type: 'datetime', nullable: true })
  public tsysRemovedManuallyDate: Date;

  @Column({ name: 'bHidden', type: 'bit', nullable: false })
  public isHidden: boolean;

  @Column({ name: 'sUserCreated', type: 'varchar', length: 25, nullable: true })
  public userCreated: string;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdAt: Date;
}
