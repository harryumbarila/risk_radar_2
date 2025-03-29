import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tblRiskRadarUser')
export class RiskRadarUser {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarUser' })
  public id: number;

  @Column({ name: 'sName', type: 'varchar', length: 50 })
  public name: string;

  @Column({ name: 'sNTUserID', type: 'varchar', length: 25 })
  public ntUserId: string;

  @Column({ name: 'bManager', type: 'bit' })
  public isManager: boolean;

  @Column({ name: 'bHidden', type: 'bit' })
  public isHidden: boolean;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdDate: Date;
} 