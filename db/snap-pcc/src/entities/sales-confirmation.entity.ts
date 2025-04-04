import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tblSalesConfirmation', schema: 'SNAP_PCC.dbo' })
export class SnapPccSalesConfirmation {
  @PrimaryColumn('varchar', { length: 20, name: 'fkAppointment' })
  public appointmentId!: string;

  @Column('varchar', { length: 16, name: 'sMID' })
  public mid!: string;

  @Column('bit', { name: 'bRiskWatch' })
  public riskWatch!: boolean;
}
