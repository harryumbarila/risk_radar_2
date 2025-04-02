import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clx.CLXReportingSearch_AVSResponseLookup' })
export class CLXReportingSearchAVSResponseLookup {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public responseCode: number;

  @Column({ length: 500, nullable: true })
  public shortName: string;

  @Column({ length: 100, nullable: true })
  public description: string;

  @Column({ length: 5, nullable: true })
  public responseCodeText: string;

  @Column()
  public isHidden: boolean;

  @Column()
  public createdAt: Date;
}
