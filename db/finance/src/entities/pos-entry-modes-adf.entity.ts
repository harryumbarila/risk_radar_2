import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'dbo.tblPOSEntryModesADF' })
export class POSEntryModesADF {
  @PrimaryGeneratedColumn({ name: 'pkDataEntryMode', type: 'int' })
  public id: number;

  @Column({
    name: 'sPOSEntryCode',
    type: 'varchar',
    length: 2,
    nullable: false,
  })
  public entryCode: string;

  @Column({
    name: 'sPOSEntryDesc',
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  public entryDescription: string;

  @Column({
    name: 'sPOSEntryMode',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  public entryMode: string | null;

  @Column({ name: 'bCardPresent', type: 'bit', nullable: false })
  public isCardPresent: boolean;

  @Column({ name: 'bHidden', type: 'bit', nullable: false })
  public isHidden: boolean;
}
