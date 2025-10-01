import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';

import { CommissionFileVariantType } from '../enums';
import { BaseEntity } from '../models';
import { CommissionFile } from './commission-file.entity';

@Entity()
@Unique(['fileId', 'variantType'])
export class CommissionFileVariant extends BaseEntity {
  @ManyToOne(() => CommissionFile, (file) => file.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'file_id' })
  public file: CommissionFile;

  @Column({ name: 'file_id' })
  public fileId: string;

  @Column({ nullable: true })
  public downloaderUserName?: string;

  @Column({ nullable: true })
  public uploaderUserName?: string;

  @Column({
    type: 'enum',
    enum: CommissionFileVariantType,
    name: 'variant_type',
  })
  public variantType: CommissionFileVariantType;

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
