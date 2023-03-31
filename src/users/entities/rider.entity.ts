import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { PaymentMethod } from '../../payment/entities/payment-method.entity';
import { Trip } from 'src/trip/entities/trip.entity';


@Entity()
export class Rider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => PaymentMethod, (paymentMethod) =>
  paymentMethod.rider, { cascade: true })
  paymentMethod: PaymentMethod[];

  @OneToOne(() => User, user => user.rider)
  @JoinColumn()
  user: User;

  @Column()
  userId:string;

  @OneToMany(() => Trip, (trip) => trip.rider)
  trip: Trip;
}