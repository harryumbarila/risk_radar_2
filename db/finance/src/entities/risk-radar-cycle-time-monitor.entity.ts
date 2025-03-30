import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tblRiskRadarCycleTimeMonitor' })
export class RiskRadarCycleTimeMonitor {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarCycleTimeMonitor' })
  public id!: number;

  @Column('varchar', { length: 3, name: 'sDayOfTheWeek' })
  public dayOfTheWeek!: string;

  @Column('varchar', { length: 2, name: 'sCycle' })
  public cycle!: string;

  @Column('varchar', { length: 10, name: 'sCycleReceivedTime', nullable: true })
  public cycleReceivedTime?: string;

  @Column('int', { name: 'iAccountType' })
  public accountType!: number;

  @Column('varchar', { length: 3, name: 'sDayOfTheFunding', nullable: true })
  public dayOfTheFunding?: string;

  @Column('int', {
    name: 'iDateDiffFundingVsTransmissionCycle',
    nullable: true,
  })
  public dateDiffFundingVsTransmissionCycle?: number;

  @Column('varchar', { length: 10, name: 'sACHFundingTime', nullable: true })
  public achFundingTime?: string;

  @Column('varchar', {
    length: 10,
    name: 'sCalcRiskRadarExceptionTime',
    nullable: true,
  })
  public calcRiskRadarExceptionTime?: string;

  @Column('datetime', { name: 'dtCreated' })
  public createdAt!: Date;
}
