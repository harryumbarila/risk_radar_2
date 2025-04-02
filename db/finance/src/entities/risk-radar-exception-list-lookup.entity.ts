import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblRiskRadarExceptionList_Lookup', { schema: 'Finance.dbo' })
export class RiskRadarExceptionListLookupEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  public id: number;

  @Column({ name: 'sDesc', type: 'varchar', length: 50, nullable: true })
  public description: string | null;

  @Column({ name: 'bHidden', type: 'bit', nullable: false })
  public isHidden: boolean;
}
