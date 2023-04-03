import { IsInt, IsNumber, IsString, IsUUID } from 'class-validator';
import { PaymentMethod } from '../entities/payment-method.entity';


export class CreateTransactionDto {


        @IsUUID()
        transactionId: string

        @IsNumber()
        rideId: number;

        @IsUUID()
        userId: string

        @IsNumber()
        paymentSourceId: number;

        @IsNumber()
        @IsInt()
        amount: number;

        @IsString()
        status: string;
}