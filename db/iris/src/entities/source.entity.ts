import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Source', { schema: 'Iris.dbo' })
export class SourceEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Column({ name: 'SourceId', type: 'bigint', nullable: true })
  public sourceId: number | null;

  @Column({ name: 'SourceName', type: 'varchar', length: 255, nullable: true })
  public sourceName: string | null;
} 