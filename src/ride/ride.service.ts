import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { CreateRideDto } from './dto/create-ride.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MakePaymentEvent } from './events/make-payment.event';
import { PaymentService } from '../payment/payment.service';
import { v4 as uuidv4 } from 'uuid';
import { Ride } from './entities/ride.entity';
import { GoogleMapsService } from '../geo-location/google-maps.service';

@Injectable()
export class RideService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ride)
    private readonly rideRepository: Repository<Ride>,
    public eventEmitter: EventEmitter2,
    private paymentService: PaymentService,
    private googleMapsService: GoogleMapsService,
  ) { }

  async create(createRideDto: CreateRideDto) {

    const { pickupLocation, dropOffLocation, email } = createRideDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.rider', 'rider')
      .where('user.email = :email', { email: email })
      .andWhere('rider.isOnRide = :isOnRide', { isOnRide: false })
      .getOne();

    if (!user) throw new BadRequestException('No hemos encontrado un usuario asociado, o ya se encuentra en viaje.');
    if (!user.rider) throw new BadRequestException('El usuario no tiene permisos para ejecutar esta función.');

    const findDriver = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.driver', 'driver')
      .where('driver IS NOT NULL')
      .andWhere('driver.isOnRide = :isOnRide', { isOnRide: false })
      .getOne();

    if (!findDriver) throw new BadRequestException('No hay conductores disponibles, intente mas tarde.');

    const pickupLocationGeoLocal = await this.googleMapsService.findGeoLocation(pickupLocation);

    if (!pickupLocationGeoLocal || pickupLocationGeoLocal.status !== 'OK' || pickupLocationGeoLocal.results.length === 0) {
      throw new BadRequestException('No hemos encontrado resultados para esta direccion de recogida.')
    }

    const dropOffLocationGeoLocal = await this.googleMapsService.findGeoLocation(dropOffLocation);

    if (!dropOffLocationGeoLocal || dropOffLocationGeoLocal.status !== 'OK' || dropOffLocationGeoLocal.results.length === 0) {
      throw new BadRequestException('No hemos encontrado resultados para esta direccion de destino.')
    }

    const ride = await this.rideRepository.save({
      rider: user.rider,
      driver: findDriver.driver,
      pickupLat: pickupLocationGeoLocal.results[0].geometry.location.lat,
      pickupLng: pickupLocationGeoLocal.results[0].geometry.location.lng,
      dropoffLat: dropOffLocationGeoLocal.results[0].geometry.location.lat,
      dropoffLng: dropOffLocationGeoLocal.results[0].geometry.location.lng,
      pickupTime: new Date()
    });

    return {
      id: ride.id,
      message: 'Hemos generado tu viaje.',
      driverFullName: `${findDriver.names} ${findDriver.lastNames}`,
      pickupTime: ride.pickupTime
    }
  }

  async finishRide(rideId: number) {

    const ride = await this.rideRepository.findOne({
      where: {
        id: rideId
      },
      relations: ['rider']
    });

    if (!ride) throw new BadRequestException('No existe el viaje indicado.');

    if (ride.status === 'CANCELED' || ride.status === 'COMPLETED') throw new BadRequestException('Este viaje ya ha sido finalizado.');

    const now = new Date();

    const distance = this.calculateDistance(ride.pickupLat, ride.pickupLng, ride.dropoffLat, ride.dropoffLng);

    const duration = Math.floor((now.getTime() - ride.pickupTime.getTime()) / 60000);

    const fare = this.calculateFare(duration, distance);

    await this.rideRepository.save({
      id: ride.id,
      status: 'COMPLETED',
      dropoffTime: now,
      duration: duration,
      distance: distance,
      fare: fare
    });

    this.eventEmitter.emit('make.payment', new MakePaymentEvent(ride.rider.userId, fare, ride.id));

    return {
      message: 'Has finalizado el viaje.',
      fare,
      pickupTime: ride.pickupTime,
      dropoffTime: now,
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
        rideId: payload.rideId
      });

    } catch (error) {
      await this.paymentService.createTransaction({
        transactionId,
        paymentSourceId: user.paymentMethod[0].id,
        amount: payload.fare * 100,
        status: 'ERROR',
        rideId: payload.rideId
      });
      console.log(error);
      throw new Error('Ha ocurrido un error al realizar el pago.')
    }



  }

}
