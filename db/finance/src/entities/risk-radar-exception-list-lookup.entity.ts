import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblRiskRadarExceptionList_Lookup')
export class RiskRadarExceptionListLookupEntity {
  @PrimaryGeneratedColumn({ name: 'pk' })
  public id: number;

  @Column({ name: 'sDesc', type: 'varchar', length: 50, nullable: true })
  public description: string;

  @Column({ name: 'bHidden', type: 'bit', nullable: false, default: false })
  public isHidden: boolean;
}
