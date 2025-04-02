import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblFSPRiskRadarExceptionPoints' })
export class FSPRiskRadarExceptionPoints {
  @PrimaryGeneratedColumn('increment', {
    name: 'pkFSPRiskRadarExceptionPoints',
  })
  public id!: number;

  @Column('datetime', { name: 'dtExceptionRunDate', nullable: true })
  public exceptionRunDate?: Date;

  @Column('varchar', { length: 10, name: 'sExceptionRunTime', nullable: true })
  public exceptionRunTime?: string;

  @Column('datetime', { name: 'dtAuthStart', nullable: true })
  public authStart?: Date;

  @Column('datetime', { name: 'dtAuthEnd', nullable: true })
  public authEnd?: Date;

  @Column('varchar', { length: 75, name: 'sSource', nullable: true })
  public source?: string;

  @Column('varchar', { length: 25, name: 'Id', nullable: true })
  public externalId?: string;

  @Column('varchar', { length: 16, name: 'sMID', nullable: true })
  public smid?: string;

  @Column('varchar', { length: 50, name: 'sExceptionType', nullable: true })
  public exceptionType?: string;

  @Column('int', { name: 'iPoints', nullable: true })
  public points?: number;

  @Column('datetime', { name: 'dtCreated' })
  public createdAt!: Date;
}
