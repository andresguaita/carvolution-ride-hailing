import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';

@Module({
  controllers: [TripController],
  providers: [TripService],
  imports: [TypeOrmModule.forFeature([Trip])],
  exports: [TypeOrmModule]
})
export class TripModule {}
