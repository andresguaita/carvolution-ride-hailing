import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';

import { Rider } from '../../users/entities/rider.entity';
import { Payment } from './payment.entity';

@Entity()
export class PaymentMethod{
    @PrimaryColumn('int')
    id:number;

    @Column()
    methodToken:string;

    @ManyToOne(() => Rider, (rider) => rider.paymentMethod)
    rider: Rider;

    riderId: string;

    @Column()
    type:string;

    @OneToMany(() => Payment, (payment) => payment.paymentMethod)
    payment: Payment;
}
