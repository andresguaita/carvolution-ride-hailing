import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Rider } from '../users/entities/rider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../users/entities/driver.entity';
import { Trip } from './entities/trip.entity';

@Injectable()
export class TripService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Rider)
    private readonly riderRepository: Repository<Rider>,
    @InjectRepository(Driver)
    private readonly driverRepository: Repository<Driver>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
  ) { }

  async create(createTripDto: CreateTripDto) {

    const { pickupLat, pickupLng, dropoffLat, dropoffLng, riderId } = createTripDto;

    const user = await this.userRepository.findOne({
      where: {
        id: riderId
      },
      relations: ['rider']
    });

    if (!user) throw new BadRequestException('No hemos encontrado un usuario asociado.');

    const findDriver = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.driver', 'driver')
      .where('driver IS NOT NULL')
      .getOne();

    if (!findDriver) throw new BadRequestException('No hay conductores disponibles, intente mas tarde.');

    const trip = await this.tripRepository.save({
      rider: user.rider,
      driver: findDriver.driver,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      pickupTime: new Date()
    });

    return {
      id: trip.id,
      message: 'Hemos generado tu viaje.',
      driverFullName: `${findDriver.names} ${findDriver.lastNames}`,
      pickupTime: trip.pickupTime
    }
  }

  async finishTrip(tripId: number) {

    const trip = await this.tripRepository.findOne({
      where: {
        id: tripId
      }
    });

    if (!trip) throw new BadRequestException('No existe el viaje indicado.');
    if (trip.status === 'CANCELED' || trip.status === 'COMPLETED') throw new BadRequestException('Este viaje ya ha sido finalizado.');

    const now = new Date();

    const distance = this.calculateDistance(trip.pickupLat, trip.pickupLng, trip.dropoffLat, trip.dropoffLng);
    
    const duration =  Math.floor((now.getTime() - trip.pickupTime.getTime()) / 60000);

    const fare = this.calculateFare(duration,distance);

    await this.tripRepository.save({
      id: tripId,
      status: 'COMPLETED',
      dropoffTime: now,
      duration,
      distance,
      fare
    })

    return {
      message: 'Has finalizado el viaje.',
      fare,
      pickupTime: trip.pickupTime,
      dropoffTime: trip.dropoffTime,
      duration
    }

  }

  calculateFare(duration: number, distanceDriven: number) {

    let baseFare = 3500; // Banderaso de 3500 .

    const distanceFare = distanceDriven*1000;
    const durationFare = duration*200;

   const totalFare= baseFare + distanceFare + durationFare;

   return totalFare;

  }

  calculateDistance(startLat: number, startLon: number, endLat: number, endLon: number): number {
    const earthRadius = 6371; // in kilometers
    const latDistance = this.deg2rad(endLat - startLat);
    const lonDistance = this.deg2rad(endLon - startLon);
    const a =
      Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
      Math.cos(this.deg2rad(startLat)) *
      Math.cos(this.deg2rad(endLat)) *
      Math.sin(lonDistance / 2) *
      Math.sin(lonDistance / 2);
    const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * centralAngle; // in kilometers
    return distance;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

}
