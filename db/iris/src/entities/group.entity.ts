import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Group', { schema: 'Iris.dbo' })
export class GroupEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Column({ name: 'GroupId', type: 'bigint', nullable: true })
  public groupId: number | null;

  @Column({ name: 'GroupName', type: 'varchar', length: 255, nullable: true })
  public groupName: string | null;
}
