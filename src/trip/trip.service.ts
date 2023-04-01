import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Rider } from '../users/entities/rider.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from '../users/entities/driver.entity';
import { Trip } from './entities/trip.entity';
import { MakePaymentEvent } from './events/make-payment.event';
import { PaymentService } from '../payment/payment.service';
import { Payment } from '../payment/entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TripService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private eventEmitter: EventEmitter2,
    private paymentService: PaymentService,
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
      },
      relations: ['rider']
    });

    if (!trip) throw new BadRequestException('No existe el viaje indicado.');
    if (trip.status === 'CANCELED' || trip.status === 'COMPLETED') throw new BadRequestException('Este viaje ya ha sido finalizado.');

    const now = new Date();

    const distance = this.calculateDistance(trip.pickupLat, trip.pickupLng, trip.dropoffLat, trip.dropoffLng);

    const duration = Math.floor((now.getTime() - trip.pickupTime.getTime()) / 60000);

    const fare = this.calculateFare(duration, distance);

    await this.tripRepository.save({
      id: tripId,
      status: 'COMPLETED',
      dropoffTime: now,
      duration: duration,
      distance: distance,
      fare:fare
    });

    this.eventEmitter.emit('make.payment', new MakePaymentEvent(trip.rider.userId, fare, tripId));

    return {
      message: 'Has finalizado el viaje.',
      fare,
      pickupTime: trip.pickupTime,
      dropoffTime: trip.dropoffTime,
      duration
    }

  }

  calculateFare(duration: number, distanceDriven: number) {

    let baseFare = 3500; // base fee of 3500 COP .

    const distanceFare = distanceDriven * 1000;
    const durationFare = duration * 200;

    const totalFare = baseFare + distanceFare + durationFare;

    return totalFare * 100 // fare in cents;

  }

  // This method calculates the distance between two points on Earth, 
  // based on their latitude and longitude coordinates, using the Haversine formula. 
  // The Haversine formula provides a good approximation of distances between two points on the Earth's 
  // surface, assuming the Earth is a perfect sphere.

  //   Calculates the distance between two points on Earth, based on their latitude and longitude coordinates, using the Haversine formula.
  //  @param startLat The latitude of the starting point, in decimal degrees.
  //  @param startLon The longitude of the starting point, in decimal degrees.
  //  @param endLat The latitude of the ending point, in decimal degrees.
  //  @param endLon The longitude of the ending point, in decimal degrees.
  //  @returns The distance between the two points, in kilometers (rounded to the nearest integer).

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
    return Math.round(distance);
  }

  // This  method is used to convert angles from degrees to radians, 
  //which is the unit used in the Haversine formula.
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  @OnEvent('make.payment')
  async makePaymeny(payload: MakePaymentEvent) {

    const transactionId = uuidv4();

    const user = await this.userRepository.findOne({
      where: {
        id: payload.userId
      },
      relations: ['paymentMethod']
    });

    try {


      const generatePayment = await this.paymentService.transactionPayment({
        amount: payload.fare,
        currency: 'COP',
        customerEmail: user.email,
        paymentSourceId: user.paymentMethod[0].id,
        reference: transactionId,
        transactionId,
        paymentMethodType: 'CARD',
        installments: 1
      });

      await this.paymentService.createTransaction({
        transactionId,
        paymentSourceId: user.paymentMethod[0].id,
        amount: generatePayment.amount,
        status: generatePayment.status,
        tripId: payload.tripId
      });

    } catch (error) {
      await this.paymentService.createTransaction({
        transactionId,
        paymentSourceId: user.paymentMethod[0].id,
        amount: payload.fare * 100,
        status: 'ERROR',
        tripId: payload.tripId
      });
      console.log(error);
      throw new Error('Ha ocurrido un error al realizar el pago.')
    }



  }

}
