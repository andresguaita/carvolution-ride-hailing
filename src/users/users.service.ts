import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async findPayments(email:string){

        try {
            const user = await this.userRepository.findOne({
                where:{
                    email
                },
                relations: ['payments','payments.paymentMethod']
            })
    
            if(!user) throw new BadGatewayException('No hemos encontrado un usuario asociado.');
    
            return {
                id: user.id,
                email: user.email,
                payments : user.payments
            }
        } catch (error) {
            console.log(error);
            throw new Error('Ha ocurrido un error inesperado, por favor espere unos minutos e intente nuevamente.');
        }




    }

}