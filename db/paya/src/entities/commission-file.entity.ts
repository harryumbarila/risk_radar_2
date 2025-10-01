import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../models';
import { CommissionFileVariant } from './commission-file-variant.entity';

@Entity()
export class CommissionFile extends BaseEntity {
  @Column({ name: 'file_name' })
  public fileName: string;

  @OneToMany(() => CommissionFileVariant, (variant) => variant.file, {
    cascade: true,
  })
  public variants: CommissionFileVariant[];
}
