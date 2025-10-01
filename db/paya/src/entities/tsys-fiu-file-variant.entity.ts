import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { TsysFiuFileVariantType } from '../enums';
import { BaseEntity } from '../models';
import { TsysFiuFile } from './tsys-fiu-file.entity';

@Entity()
@Unique(['fileId', 'variantType'])
export class TsysFiuFileVariant extends BaseEntity {
  @ManyToOne(() => TsysFiuFile, (file) => file.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'file_id' })
  public file: TsysFiuFile;

  @Column({ name: 'file_id' })
  public fileId: string;

  @Column({ nullable: true })
  public downloaderUserName?: string;

  @Column({ nullable: true })
  public uploaderUserName?: string;

  @Column({
    type: 'enum',
    enum: TsysFiuFileVariantType,
    name: 'variant_type',
  })
  public variantType: TsysFiuFileVariantType;

  @Column()
  public s3DirectoryPath: string;

  @Column()
  public contentsHash: string;

  @Column({ type: 'bool', default: true })
  public validHash: boolean;

  @Column({ type: 'inet', nullable: true })
  public uploaderIp?: string;

  @Column({ type: 'timestamptz', nullable: true })
  public downloadedAt?: Date;

  @Column({ type: 'inet', nullable: true })
  public downloaderIp?: string;

  @Column({ type: 'timestamptz', nullable: true })
  public modifiedAt?: Date;
}
