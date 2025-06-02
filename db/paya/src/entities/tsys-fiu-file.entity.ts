/* eslint-disable import/no-cycle */
import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../models';
import { TsysFiuFileVariant } from './tsys-fiu-file-variant.entity';

@Entity()
export class TsysFiuFile extends BaseEntity {
  @Column({ name: 'file_name' })
  public fileName: string;

  @OneToMany(() => TsysFiuFileVariant, (variant) => variant.file, {
    cascade: true,
  })
  public variants: TsysFiuFileVariant[];
}
