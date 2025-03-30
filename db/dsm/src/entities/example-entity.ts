import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../models';

@Entity()
export class ExampleEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  public name: string;
}
