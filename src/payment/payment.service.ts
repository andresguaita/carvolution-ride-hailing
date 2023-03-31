import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { AcceptanceTokenResponse } from './interface/acceptance-token-response.interface';

@Injectable()
export class PaymentService {

    private publicKey: string;
    private privateKey: string;
    private host: string;

    constructor(private readonly http: AxiosAdapter) {
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

}