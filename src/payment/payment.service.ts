import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { AcceptanceTokenResponse } from './interface/acceptance-token-response.interface';
import { TransactionPaymentDto } from './dto/transaction-payment.dto';
import { BodyTransactionPayment } from './interface/body-transaction-payment.interface';
import { TransactionPaymentResponse } from './interface/transaction-payment-response.interface-response.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {

    private publicKey: string;
    private privateKey: string;
    private host: string;

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly http: AxiosAdapter) {
        this.publicKey = process.env.PUB_KEY_PAYMENT_GATEWAY;
        this.privateKey = process.env.PRIV_KEY_PAYMENT_GATEWAY;
        this.host = process.env.PAYMENT_GATEWAY_HOST
    }

    async generateAcceptanceToken() {

        try {

            const acceptanceToken = await this.http.get<AcceptanceTokenResponse>(
                `${this.host}/merchants/${this.publicKey}`);

            return acceptanceToken.data.presigned_acceptance.acceptance_token;


        } catch (error) {
            console.log(error)
            throw Error('Ha ocurrido un error inesperado, por favor intente mas tarde.')
        }

    }

    async transactionPayment(transactionPaymentDto: TransactionPaymentDto) {
        const { amount, currency, customerEmail, paymentSourceId, reference, paymentMethodType, installments } = transactionPaymentDto;

        let bodyTransactionPayment: BodyTransactionPayment = {
            amount_in_cents: amount * 100,
            currency,
            customer_email: customerEmail,
            reference,
            payment_source_id: paymentSourceId
        };

        if (paymentMethodType === 'CARD') bodyTransactionPayment.payment_method = { installments };

        try {
            const createTransaction = await this.http.post<TransactionPaymentResponse>(
                `${this.host}/transactions`,
                bodyTransactionPayment,
                {
                    headers: {
                        'accept': '*/*',
                        'Authorization': `Bearer ${this.privateKey}`,
                        'Content-Type': 'application/json'
                    }
                });
            
            await this.paymentRepository.save({
                paymentMethod: <any>{id: paymentSourceId},
                amount,
                status: createTransaction.data.status
            }
            );

        return {
            amount,
            status: createTransaction.data.status
        }
    
        } catch (error) {
            console.log(error)
            throw Error('Ha ocurrido un error inesperado, por favor intente mas tarde.')
        }

    }



}