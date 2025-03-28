import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../models';

@Entity()
export class FinanceEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public description: string;
}
