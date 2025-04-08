import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CLXReportingSearch_PaymentMethodLookup', schema: 'clx' })
export class CLXReportingSearchPaymentMethodLookup {
  @PrimaryGeneratedColumn({ name: 'pkCLXAuthPaymentMethod' })
  public id: number;

  @Column({ name: 'iPaymentMethodKey', type: 'int', nullable: true })
  public methodKey: number | null;

  @Column({
    name: 'sPaymentMethodDesc',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  public description: string | null;

  @Column({ name: 'bCardPresentTalusDefined', type: 'bit' })
  public isCardPresentTalusDefined: boolean;

  @Column({ name: 'bHidden', type: 'bit' })
  public isHidden: boolean;

  @Column({ name: 'dtCreated', type: 'datetime' })
  public createdAt: Date;
}
