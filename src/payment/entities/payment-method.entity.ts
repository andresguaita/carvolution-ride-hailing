import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';

import { Rider } from '../../users/entities/rider.entity';
import { Payment } from './payment.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class PaymentMethod{
    @PrimaryColumn('int')
    id:number;

    @Column()
    methodToken:string;

    @ManyToOne(() => User, (user) => user.paymentMethod)
    user: User;

    userId: string;

    @Column()
    type:string;

    @OneToMany(() => Payment, (payment) => payment.paymentMethod)
    payment: Payment;

    @Column()
    isSetAsDefault:boolean;
}
