import { Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Driver } from './driver.entity';
import { Rider } from './rider.entity';
import { PaymentMethod } from '../../payment/entities/payment-method.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({unique:true})
  email: string;

  @Column()
  password: string;

  @Column()
  names:string;

  @Column()
  lastNames:string;

  @OneToOne(() => Driver, driver => driver.user)
  driver: Driver;

  @OneToOne(() => Rider, rider => rider.user)
  rider: Rider;

  @OneToMany(() => PaymentMethod, (paymentMethod) =>
  paymentMethod.user)
  paymentMethod: PaymentMethod[];

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}