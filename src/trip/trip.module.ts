import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { User } from '../users/entities/user.entity';
import { Driver } from '../users/entities/driver.entity';
import { Rider } from '../users/entities/rider.entity';

@Module({
  controllers: [TripController],
  providers: [TripService],
  imports: [TypeOrmModule.forFeature([Trip,User,Driver,Rider])],
  exports: [TypeOrmModule]
})
export class TripModule {}
