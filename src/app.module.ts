import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { PaymentModule } from './payment/payment.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RideModule } from './ride/ride.module';

@Module({
  imports: [ConfigModule.forRoot(),
  EventEmitterModule.forRoot(),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'production' ? false : true,
  }),
    UsersModule,
    PaymentModule,
    RideModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
