import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'tbl_adf_auth_data',
  schema: 'TSYS',
  database: 'RiskRadar',
})
export class AdfAuthData {
  @PrimaryGeneratedColumn({ name: 'pk' })
  id: number;

  @Column({ name: 'FileId', type: 'varchar', length: 255, nullable: true })
  fileId?: string;

  @Column({ name: 'MId', type: 'varchar', length: 16, nullable: true })
  merchantId?: string;

  @Column({ name: 'auth_date', type: 'datetime', nullable: true })
  authDate?: Date;
}
