import { IsString,IsNumber,Length,IsEmail,IsOptional, IsUUID} from "class-validator";


export class TransactionPaymentDto{

    @IsUUID()
    transactionId:string;

    @IsNumber()
    amount:number;

    @IsString()
    @Length(2)
    currency:string;

    @IsEmail()
    customerEmail:string;

    @IsNumber()
    paymentSourceId:number;

    @IsString()
    reference:string;

    @IsString()
    paymentMethodType:string;

    @IsOptional()
    @IsNumber()
    installments?:number;
   
}