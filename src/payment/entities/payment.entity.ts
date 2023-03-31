import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PaymentMethod } from "./payment-method.entity";


@Entity()
export class Payment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payment)
    paymentMethod: PaymentMethod;

    @Column({type: 'float'})
    amount:number;

    @Column()
    status: 'PAGADO' | 'PAGO PENDIENTE' | 'PAGO DENEGADO'

    @Column()
    paymentMethodId: number;

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