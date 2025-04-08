import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CLXReportingSearch_AVSResponseLookup', schema: 'clx' })
export class CLXReportingSearchAVSResponseLookup {
  @PrimaryGeneratedColumn({ name: 'pkCLXAuthAVSResp' })
  public id: number;

  @Column({ name: 'iAVSResp', type: 'int', nullable: true })
  public responseCode: number | null;

  @Column({
    name: 'sAVSRespShortName',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  public shortName: string | null;

  @Column({
    name: 'sAVSRespDesc',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  public description: string | null;

  @Column({ name: 'sAVSRespCode', type: 'varchar', length: 5, nullable: true })
  public responseCodeText: string | null;

  @Column({ name: 'bHidden', type: 'bit' })
  public isHidden: boolean;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdAt: Date;
}
