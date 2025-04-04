import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'tblSalesConfirmation', schema: 'DSM.dbo' })
export class DSMSalesConfirmation {
  @PrimaryColumn('varchar', { length: 20, name: 'fkAppointment' })
  public appointmentId!: string;

  @Column('varchar', { length: 16, name: 'sMID' })
  public mid!: string;

  @Column('bit', { name: 'bRiskWatch' })
  public riskWatch!: boolean;
}
