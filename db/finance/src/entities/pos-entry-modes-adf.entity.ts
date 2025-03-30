import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'dbo.tblPOSEntryModesADF' })
export class POSEntryModesADF {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 2 })
  public entryCode: string;

  @Column({ length: 200 })
  public entryDescription: string;

  @Column({ length: 20, nullable: true })
  public entryMode: string;

  @Column()
  public isCardPresent: boolean;

  @Column()
  public isHidden: boolean;
}
