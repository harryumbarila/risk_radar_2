import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('LeadsOwner', { schema: 'Iris.dbo' })
export class LeadsOwnerEntity {
  @PrimaryGeneratedColumn({ name: 'Id' })
  public id: number;

  @Column({ name: 'LeadId', type: 'bigint', nullable: true })
  public leadId: number | null;

  @Column({ name: 'FirstName', type: 'varchar', length: 100, nullable: true })
  public firstName: string | null;

  @Column({ name: 'LastName', type: 'varchar', length: 100, nullable: true })
  public lastName: string | null;

  @Column({
    name: 'SocialSecurityNumber',
    type: 'varchar',
    length: 11,
    nullable: true,
  })
  public socialSecurityNumber: string | null;

  @Column({ name: 'DOB', type: 'datetime', nullable: true })
  public dateOfBirth: Date | null;

  @Column({ name: 'ManagerController', type: 'bit', nullable: true })
  public managerController: boolean | null;

  @Column({ name: 'AuthorizedSigner', type: 'bit', nullable: true })
  public authorizedSigner: boolean | null;
}
