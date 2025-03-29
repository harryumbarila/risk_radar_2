import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblFSPRiskRadarExceptionPoints', {
  schema: 'dbo',
  database: 'Finance',
})
export class FSPRiskRadarExceptionPointsEntity {
  @PrimaryGeneratedColumn({
    name: 'pkFSPRiskRadarExceptionPoints',
    type: 'bigint',
  })
  public id: number;

  @Column({ name: 'dtExceptionRunDate', type: 'datetime', nullable: true })
  public exceptionRunDate: Date;

  @Column({
    name: 'sExceptionRunTime',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  public exceptionRunTime: string;

  @Column({ name: 'dtAuthStart', type: 'datetime', nullable: true })
  public authStartDate: Date;

  @Column({ name: 'dtAuthEnd', type: 'datetime', nullable: true })
  public authEndDate: Date;

  @Column({ name: 'sSource', type: 'varchar', length: 75, nullable: true })
  public source: string;

  @Column({ name: 'Id', type: 'varchar', length: 25, nullable: true })
  public externalId: string;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: true })
  public mid: string;

  @Column({
    name: 'sExceptionType',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public exceptionType: string;

  @Column({ name: 'iPoints', type: 'int', nullable: true })
  public points: number;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdAt: Date;
}
