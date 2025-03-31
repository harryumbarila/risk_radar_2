import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clx.CLXReportingSearch_PaymentMethodLookup' })
export class CLXReportingSearchPaymentMethodLookup {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public methodKey: number;

  @Column({ length: 50, nullable: true })
  public description: string;

  @Column()
  public isCardPresentTalusDefined: boolean;

  @Column()
  public isHidden: boolean;

  @Column()
  public createdAt: Date;
}
