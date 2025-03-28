import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblRiskRadarEMailTemplate')
export class RiskRadarEMailTemplateEntity {
  @PrimaryGeneratedColumn({ name: 'pkRiskRadarEMailTemplate' })
  public id: number;

  @Column({
    name: 'sTemplateName',
    type: 'varchar',
    length: 250,
    nullable: false,
  })
  public templateName: string;

  @Column({
    name: 'sTemplateEMailBody',
    type: 'varchar',
    nullable: false,
  })
  public templateEmailBody: string;

  @Column({ name: 'bHidden', type: 'bit', nullable: false, default: false })
  public isHidden: boolean;

  @Column({
    name: 'dtCreated',
    type: 'datetime',
    nullable: false,
    default: () => 'GETDATE()',
  })
  public createdAt: Date;
}
