import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity()
export class PaymentGatewayLogging{

    @PrimaryGeneratedColumn('increment')
    id:string;

    @Column({type: 'json'})
    apiResponse:object;

    @Column({type:'json'})
    apiRequest:object;

    @CreateDateColumn({
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date;

}