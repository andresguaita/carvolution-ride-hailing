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

    if(!findDriver) throw new BadRequestException('No hay conductores disponibles, intente mas tarde.');

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

  async finishTrip(tripId:number){

    const trip = await this.tripRepository.findOne({
      where:{
        id: tripId
      }
    });

    

  }

}
