import { Module, Logger, forwardRef } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Driver } from '../users/entities/driver.entity';
import { Rider } from '../users/entities/rider.entity';
import { PaymentMethod } from '../payment/entities/payment-method.entity';
import { initialData } from './data/seed-data';
import { Trip } from 'src/trip/entities/trip.entity';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentGatewayLogging } from 'src/payment/entities/payment-gateway-logging.entity';


@Module({
  controllers: [],
  providers: [SeedService, Logger,    {
    provide: 'INITIAL_DATA',
    useValue: initialData,
  },],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT')),
          database: configService.get('DB_NAME'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          entities: [User,Driver,Rider,PaymentMethod,Trip,Payment,PaymentGatewayLogging],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([User,Driver,Rider,PaymentMethod,Trip,Payment,PaymentGatewayLogging])    
  ]
})
export class SeedModule { }
