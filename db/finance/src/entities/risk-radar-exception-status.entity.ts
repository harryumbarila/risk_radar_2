import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'tblRiskRadarExceptionStatus',
  schema: 'dbo',
  database: 'Finance',
})
export class RiskRadarExceptionStatusEntity {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarExceptionStatus' })
  public id: number;

  @Column({
    name: 'sExceptionStatusDesc',
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  public description: string;

  @Column({ name: 'iSortOrder', type: 'int', nullable: false })
  public sortOrder: number;

  @Column({ name: 'bHidden', type: 'bit', nullable: false })
  public isHidden: boolean;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdAt: Date;
}
