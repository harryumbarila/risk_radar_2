import { Column, Entity } from 'typeorm';

@Entity('tblSnapShotvwLeadsStatusActive')
export class SnapShotvwLeadsStatusActive {
  @Column({ name: 'iOrder', type: 'int', nullable: true })
  public order: number | null;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public merchantId: string | null;

  @Column({ name: 'dtActivated', type: 'datetime', nullable: true })
  public activatedDate: Date | null;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdDate: Date;
} 