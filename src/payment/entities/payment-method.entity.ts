import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ManyToOne } from 'typeorm';

import { Rider } from '../../users/entities/rider.entity';

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
}
