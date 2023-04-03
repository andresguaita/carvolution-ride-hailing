import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Driver } from '../users/entities/driver.entity';
import { Rider } from '../users/entities/rider.entity';
import { PaymentModule } from '../payment/payment.module';
import { Ride } from './entities/ride.entity';
import { GoogleMapsModule } from '../geo-location/google-maps.module';

@Module({
  controllers: [RideController],
  providers: [RideService],
  imports: [TypeOrmModule.forFeature([Ride,User,Driver,Rider]),PaymentModule,GoogleMapsModule],
  exports: [TypeOrmModule]
})
export class RideModule {}
