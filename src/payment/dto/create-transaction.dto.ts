import { PaymentMethod } from '../entities/payment-method.entity';


export class CreateTransactionDto{

        transactionId:string

        tripId:number;

        paymentSourceId: number;

        amount:number;

        status: string;
}