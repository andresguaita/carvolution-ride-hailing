import { Entity, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { PaymentMethod } from "./payment-method.entity";
import { Ride } from '../../ride/entities/ride.entity';
import { User } from '../../users/entities/user.entity';


@Entity()
export class Payment {

    @PrimaryColumn()
    id: string;

    @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payment)
    paymentMethod: PaymentMethod;

    @Column({type: 'float'})
    amount:number;

    @Column()
    status:string;

    @Column()
    paymentMethodId: number;

    @ManyToOne(type => Ride, ride => ride.payments)
    ride: Ride;

    @Column()
    rideId:number;

    @ManyToOne(type => User, user => user.payments)
    user: User;

    @Column()
    userId:string;

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