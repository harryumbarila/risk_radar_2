import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblRiskRadarMerchAdjParam', { schema: 'Finance.dbo' })
export class RiskRadarMerchAdjParamEntity {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarMerchAdjParam' })
  public id: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: false })
  public mid: string;

  @Column({ name: 'iAvgTkt', type: 'int', nullable: false })
  public avgTicket: number;

  @Column({ name: 'iHighTkt', type: 'int', nullable: false })
  public highTicket: number;

  @Column({ name: 'iMonVol', type: 'int', nullable: false })
  public monthlyVolume: number;

  @Column({ name: 'iSwipePercent', type: 'int', nullable: false })
  public swipePercent: number;

  @Column({ name: 'sBBB', type: 'varchar', length: 1, nullable: true })
  public bbb: string | null;

  @Column({ name: 'bDivert', type: 'bit', nullable: false })
  public isDivert: boolean;

  @Column({ name: 'sPreferredContact', type: 'varchar', length: 100, nullable: true })
  public preferredContact: string | null;

  @Column({ name: 'dtCreated', type: 'datetime', nullable: false })
  public createdDate: Date;

  @Column({ name: 'bNewAccount', type: 'bit', nullable: false })
  public isNewAccount: boolean;

  @Column({ name: 'iAvgTkt_CalcMonthly', type: 'int', nullable: true })
  public avgTicketCalcMonthly: number | null;

  @Column({ name: 'iMonVol_CalcMonthly', type: 'int', nullable: true })
  public monthlyVolumeCalcMonthly: number | null;

  @Column({ name: 'iSwipePercent_CalcMonthly', type: 'int', nullable: true })
  public swipePercentCalcMonthly: number | null;

  @Column({ name: 'bRiskWatch', type: 'bit', nullable: false })
  public isRiskWatch: boolean;

  @Column({ name: 'bNextDayFundingAcct', type: 'bit', nullable: false })
  public isNextDayFundingAcct: boolean;

  @Column({ name: 'bAutoHoldWhiteLabel', type: 'bit', nullable: false })
  public isAutoHoldWhiteLabel: boolean;

  @Column({ name: 'dtNewAccount', type: 'datetime', nullable: true })
  public newAccountDate: Date | null;

  @Column({ name: 'iNewAccountBatchDays', type: 'int', nullable: true })
  public newAccountBatchDays: number | null;
} 