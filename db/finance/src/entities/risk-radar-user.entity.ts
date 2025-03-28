import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblRiskRadarUser')
export class RiskRadarUserEntity {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarUser' })
  public id: number;

  @Column({ name: 'sName', type: 'varchar', length: 50, nullable: false })
  public name: string;

  @Column({ name: 'sNTUserID', type: 'varchar', length: 25, nullable: false })
  public ntUserId: string;

  @Column({ name: 'bManager', type: 'bit', nullable: false })
  public isManager: boolean;

  @Column({ name: 'bHidden', type: 'bit', nullable: false })
  public isHidden: boolean;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdAt: Date;
}
