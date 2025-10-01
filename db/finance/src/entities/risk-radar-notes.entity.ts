import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblRiskRadarNotes')
export class RiskRadarNotesEntity {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarNotes' })
  public id: number;

  @Column({ name: 'fkRiskRadarNotesType', type: 'int', nullable: false })
  public notesTypeId: number;

  @Column({ name: 'sMID', type: 'varchar', length: 16, nullable: false })
  public mid: string;

  @Column({ name: 'sNotes', type: 'varchar', length: 500, nullable: false })
  public notes: string;

  @Column({ name: 'bHidden', type: 'bit', nullable: false, default: false })
  public isHidden: boolean;

  @Column({
    name: 'dtCreated',
    type: 'datetime',
    nullable: false,
    default: () => 'GETDATE()',
  })
  public createdAt: Date;

  @Column({
    name: 'sUserCreated',
    type: 'varchar',
    length: 25,
    nullable: false,
  })
  public userCreated: string;

  @Column({ name: 'dtIrisMemoRequest', type: 'datetime', nullable: true })
  public irisMemoRequestDate: Date | null;

  @Column({
    name: 'dtIrisMemoRequestFulfilled',
    type: 'datetime',
    nullable: true,
  })
  public irisMemoRequestFulfilledDate: Date;
}
