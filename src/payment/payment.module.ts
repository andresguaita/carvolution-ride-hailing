
import { Module } from '@nestjs/common';
import { PaymentMethod } from './entities/payment-method.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { CommonModule } from '../common/common.module';
import { PaymentGatewayLogging } from './entities/payment-gateway-logging.entity';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService],
    imports: [TypeOrmModule.forFeature([PaymentMethod,Payment,PaymentGatewayLogging]),CommonModule],
    exports: [TypeOrmModule,PaymentService]
})
export class PaymentModule{

}