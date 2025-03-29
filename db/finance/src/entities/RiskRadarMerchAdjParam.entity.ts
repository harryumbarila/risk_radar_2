import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tblRiskRadarMerchAdjParam')
export class RiskRadarMerchAdjParam {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarMerchAdjParam' })
  public id: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16 })
  public merchantId: string;

  @Column({ name: 'iAvgTkt', type: 'int' })
  public averageTicket: number;

  @Column({ name: 'iHighTkt', type: 'int' })
  public highTicket: number;

  @Column({ name: 'iMonVol', type: 'int' })
  public monthlyVolume: number;

  @Column({ name: 'iSwipePercent', type: 'int' })
  public swipePercent: number;

  @Column({ name: 'sBBB', type: 'varchar', length: 1, nullable: true })
  public bbbRating: string | null;

  @Column({ name: 'bDivert', type: 'bit' })
  public isDivert: boolean;

  @Column({ name: 'sPreferredContact', type: 'varchar', length: 100, nullable: true })
  public preferredContact: string | null;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdDate: Date;

  @Column({ name: 'bNewAccount', type: 'bit' })
  public isNewAccount: boolean;

  @Column({ name: 'iAvgTkt_CalcMonthly', type: 'int', nullable: true })
  public averageTicketCalcMonthly: number | null;

  @Column({ name: 'iMonVol_CalcMonthly', type: 'int', nullable: true })
  public monthlyVolumeCalcMonthly: number | null;

  @Column({ name: 'iSwipePercent_CalcMonthly', type: 'int', nullable: true })
  public swipePercentCalcMonthly: number | null;

  @Column({ name: 'bRiskWatch', type: 'bit' })
  public isRiskWatch: boolean;

  @Column({ name: 'bNextDayFundingAcct', type: 'bit' })
  public isNextDayFundingAccount: boolean;

  @Column({ name: 'bAutoHoldWhiteLabel', type: 'bit' })
  public isAutoHoldWhiteLabel: boolean;

  @Column({ name: 'dtNewAccount', type: 'datetime', nullable: true })
  public newAccountDate: Date | null;

  @Column({ name: 'iNewAccountBatchDays', type: 'int', nullable: true })
  public newAccountBatchDays: number | null;
} 