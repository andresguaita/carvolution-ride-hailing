
import { Module } from '@nestjs/common';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { CommonModule } from '../common/common.module';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService],
    imports: [TypeOrmModule.forFeature([PaymentMethod,Payment]),CommonModule],
    exports: [TypeOrmModule]
})
export class PaymentModule{

}