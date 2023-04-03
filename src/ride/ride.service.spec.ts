import { RideService } from './ride.service';
import { BadRequestException } from '@nestjs/common';
import { Ride } from './entities/ride.entity';
import { User } from '../users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentService } from '../payment/payment.service';
import { Repository } from 'typeorm';
import { Rider } from '../users/entities/rider.entity';
import { Driver } from '../users/entities/driver.entity';
import { MakePaymentEvent } from './events/make-payment.event';
import { GoogleMapsService } from '../geo-location/google-maps.service';

describe('RideService', () => {
    let rideService: RideService;
    let rideRepositoryMock: Repository<Ride>;
    let userRepositoryMock: Repository<User>;
    let eventEmitterMock: EventEmitter2 = {} as any;
    let paymentService: PaymentService = {} as any;
    let googleMapsService: GoogleMapsService = {} as any;
    beforeEach(() => {
        rideRepositoryMock = {
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn(),
            }),
        } as any;
        userRepositoryMock = {
            findOne: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue({
                leftJoinAndSelect: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                andWhere: jest.fn().mockReturnThis(),
                getOne: jest.fn(),
            }),
        } as any;
        eventEmitterMock = {
            emit: jest.fn(),
        } as any;

        googleMapsService = {
            findGeoLocation: jest.fn(),
        } as any;

        rideService = new RideService(
            userRepositoryMock,
            rideRepositoryMock,
            eventEmitterMock,
            paymentService,
            googleMapsService
        );
    });

    describe('Create', () => {
        it('should create a ride successfully if valid data is provided and a driver is available', async () => {
            // Arrange
            const createRideDto = {
                pickupLocation: "chipre manizales",
                dropOffLocation: "clinica santillana manizales",
                email: 'test@example.com',
            };
            const user = new User();
            user.email = createRideDto.email;
            user.rider = new Rider();
            const driver = new User();
            driver.names = 'Test';
            driver.lastNames = 'Driver';
            driver.driver = new Driver();
            (userRepositoryMock.createQueryBuilder().getOne as jest.Mock)
                .mockResolvedValueOnce(user)
                .mockResolvedValueOnce(driver);
            const savedRide = new Ride();
            savedRide.id = 1;
            savedRide.pickupTime = new Date();
            (rideRepositoryMock.save as jest.Mock).mockResolvedValue(savedRide);
            jest.spyOn(googleMapsService, 'findGeoLocation').mockResolvedValue({
                "results": [
                    {
                        "address_components": [
                            {
                                "long_name": "Chipre",
                                "short_name": "Chipre",
                                "types": [
                                    "neighborhood",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "Manizales",
                                "short_name": "Manizales",
                                "types": [
                                    "locality",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "Manizales",
                                "short_name": "Manizales",
                                "types": [
                                    "administrative_area_level_2",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "Caldas",
                                "short_name": "Caldas",
                                "types": [
                                    "administrative_area_level_1",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "Colombia",
                                "short_name": "CO",
                                "types": [
                                    "country",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "170001",
                                "short_name": "170001",
                                "types": [
                                    "postal_code"
                                ]
                            }
                        ],
                        "formatted_address": "Chipre, Manizales, Caldas, Colombia",
                        "geometry": {
                            "bounds": {
                                "northeast": {
                                    "lat": 5.0830039,
                                    "lng": -75.52276069999999
                                },
                                "southwest": {
                                    "lat": 5.0666533,
                                    "lng": -75.5284791
                                }
                            },
                            "location": {
                                "lat": 5.0761842,
                                "lng": -75.5254863
                            },
                            "location_type": "APPROXIMATE",
                            "viewport": {
                                "northeast": {
                                    "lat": 5.0830039,
                                    "lng": -75.52276069999999
                                },
                                "southwest": {
                                    "lat": 5.0666533,
                                    "lng": -75.5284791
                                }
                            }
                        },
                        "place_id": "ChIJK9vZj-FvR44RO71lraNDNjs",
                        "types": [
                            "neighborhood",
                            "political"
                        ]
                    }
                ],
                "status": "OK"
            });
            jest.spyOn(googleMapsService, 'findGeoLocation').mockResolvedValue({
                "results": [
                    {
                        "address_components": [
                            {
                                "long_name": "56 - 50",
                                "short_name": "56 - 50",
                                "types": [
                                    "street_number"
                                ]
                            },
                            {
                                "long_name": "Carrera 24",
                                "short_name": "Cra. 24",
                                "types": [
                                    "route"
                                ]
                            },
                            {
                                "long_name": "Manizales",
                                "short_name": "Manizales",
                                "types": [
                                    "locality",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "Manizales",
                                "short_name": "Manizales",
                                "types": [
                                    "administrative_area_level_2",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "Caldas",
                                "short_name": "Caldas",
                                "types": [
                                    "administrative_area_level_1",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "Colombia",
                                "short_name": "CO",
                                "types": [
                                    "country",
                                    "political"
                                ]
                            },
                            {
                                "long_name": "170004",
                                "short_name": "170004",
                                "types": [
                                    "postal_code"
                                ]
                            }
                        ],
                        "formatted_address": "Cra. 24 #56 - 50, Manizales, Caldas, Colombia",
                        "geometry": {
                            "location": {
                                "lat": 5.060557999999999,
                                "lng": -75.4917172
                            },
                            "location_type": "ROOFTOP",
                            "viewport": {
                                "northeast": {
                                    "lat": 5.061985030291502,
                                    "lng": -75.49038091970849
                                },
                                "southwest": {
                                    "lat": 5.059287069708497,
                                    "lng": -75.4930788802915
                                }
                            }
                        },
                        "place_id": "ChIJA-RTq5RlR44RaIFfrea0EIE",
                        "types": [
                            "establishment",
                            "health",
                            "point_of_interest"
                        ]
                    }
                ],
                "status": "OK"
            });

            // Act
            const result = await rideService.create(createRideDto);
            // Assert
            expect(result).toEqual({
                id: savedRide.id,
                message: 'Hemos generado tu viaje.',
                driverFullName: `${driver.names} ${driver.lastNames}`,
                pickupTime: savedRide.pickupTime,
            });

            expect(userRepositoryMock.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('user.rider', 'rider');
            expect(userRepositoryMock.createQueryBuilder().where).toHaveBeenCalledWith('user.email = :email', { email: createRideDto.email });
            expect(userRepositoryMock.createQueryBuilder().andWhere).toHaveBeenCalledWith('rider.isOnRide = :isOnRide', { isOnRide: false });
            expect(userRepositoryMock.createQueryBuilder().getOne).toHaveBeenCalled();

            expect(userRepositoryMock.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('user.driver', 'driver');
            expect(userRepositoryMock.createQueryBuilder().where).toHaveBeenCalledWith('driver IS NOT NULL');
            expect(userRepositoryMock.createQueryBuilder().andWhere).toHaveBeenCalledWith('driver.isOnRide = :isOnRide', { isOnRide: false });
            expect(userRepositoryMock.createQueryBuilder().getOne).toHaveBeenCalled();
            expect(rideRepositoryMock.save).toHaveBeenCalledWith({
                rider: user.rider,
                driver: driver.driver,
                dropoffLat: 5.060557999999999,
                dropoffLng: -75.4917172,
                pickupLat: 5.060557999999999,
                pickupLng: -75.4917172,
                pickupTime: expect.any(Date),
            });
        });


        // it('should throw an error if no user is found', async () => {
        //     // Arrange
        //     const createRideDto = {
        //         pickupLocation: "chipre manizales",
        //         dropOffLocation: "clinica santillana manizales",
        //         email: 'test@example.com',
        //     };
        //     (userRepositoryMock.findOne as jest.Mock).mockResolvedValue(undefined);

        //     // Act & Assert
        //     await expect(rideService.create(createRideDto)).rejects.toThrow(BadRequestException);
        //     expect(userRepositoryMock.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalledWith('user.rider', 'rider');
        //     expect(userRepositoryMock.createQueryBuilder().where).toHaveBeenCalledWith('user.email = :email', {  email: createRideDto.email });
        //     expect(userRepositoryMock.createQueryBuilder().andWhere).toHaveBeenCalledWith('rider.isOnRide = :isOnRide', { isOnRide: false });
        //     expect(userRepositoryMock.createQueryBuilder().getOne).toHaveBeenCalled();
        // });
    })

    // describe('Finish Ride', () => {
    //     it('should successfully finish a ride if valid data is provided', async () => {
    //         // Arrange
    //         const rideId = 1;
    //         const ride = new Ride();
    //         ride.id = rideId;
    //         ride.pickupTime = new Date();
    //         ride.pickupLat = 1;
    //         ride.pickupLng = 1;
    //         ride.dropoffLat = 2;
    //         ride.dropoffLng = 2;
    //         ride.rider = new Rider();
    //         ride.status = 'IN PROGRESS';
    //         (rideRepositoryMock.findOne as jest.Mock).mockResolvedValue(ride);
    //         const distance = 2.5;
    //         const fare = 10;
    //         const calculateDistanceSpy = jest.spyOn(rideService, 'calculateDistance').mockReturnValue(distance);
    //         const calculateFareSpy = jest.spyOn(rideService, 'calculateFare').mockReturnValue(fare);
    //         const emitSpy = jest.spyOn(eventEmitterMock, 'emit');

    //         // Act
    //         const result = await rideService.finishRide(rideId);

    //         // Assert
    //         expect(result).toEqual({
    //             message: 'Has finalizado el viaje.',
    //             fare: fare,
    //             pickupTime: result.pickupTime,
    //             dropoffTime: result.dropoffTime,
    //             duration: result.duration,
    //         });
    //         expect(rideRepositoryMock.findOne).toHaveBeenCalledWith({
    //             where: { id: rideId },
    //             relations: ['rider'],
    //         });
    //         expect(calculateDistanceSpy).toHaveBeenCalledWith(
    //             ride.pickupLat,
    //             ride.pickupLng,
    //             ride.dropoffLat,
    //             ride.dropoffLng
    //         );
    //         expect(calculateFareSpy).toHaveBeenCalledWith(result.duration, distance);
    //         expect(rideRepositoryMock.save).toHaveBeenCalledWith({
    //             id: ride.id,
    //             status: 'COMPLETED',
    //             dropoffTime: expect.any(Date),
    //             duration: result.duration,
    //             distance: distance,
    //             fare: fare,
    //         });
    //         expect(emitSpy).toHaveBeenCalledWith(
    //             'make.payment',
    //             expect.any(MakePaymentEvent)
    //         );
    //     });

    //     it('should throw an error if the ride does not exist', async () => {
    //         // Arrange
    //         const rideId = 1;
    //         (rideRepositoryMock.findOne as jest.Mock).mockResolvedValue(undefined);

    //         // Act & Assert
    //         await expect(rideService.finishRide(rideId)).rejects.toThrow(
    //             BadRequestException
    //         );
    //         expect(rideRepositoryMock.findOne).toHaveBeenCalledWith({
    //             where: { id: rideId },
    //             relations: ['rider'],
    //         });
    //     });

    //     it('should throw an error if the ride has already been completed', async () => {
    //         // Arrange
    //         const rideId = 1;
    //         const ride = new Ride();
    //         ride.id = rideId;
    //         ride.status = 'COMPLETED';
    //         (rideRepositoryMock.findOne as jest.Mock).mockResolvedValue(ride);

    //         // Act & Assert
    //         await expect(rideService.finishRide(rideId)).rejects.toThrow(
    //             BadRequestException
    //         );
    //         expect(rideRepositoryMock.findOne).toHaveBeenCalledWith({
    //             where: {
    //                 id: rideId
    //             },
    //             relations: ['rider']
    //         });
    //         expect(rideRepositoryMock.save).not.toHaveBeenCalled();
    //         expect(eventEmitterMock.emit).not.toHaveBeenCalled();
    //     });

    //     it('should complete the ride and emit a payment event if the ride has not been canceled or completed', async () => {
    //         // Arrange
    //         const rideId = 1;
    //         const ride = new Ride();
    //         ride.id = rideId;
    //         ride.status = 'IN PROGRESS';
    //         ride.pickupLat = 37.7749;
    //         ride.pickupLng = -122.4194;
    //         ride.dropoffLat = 37.3352;
    //         ride.dropoffLng = -121.8811;
    //         ride.pickupTime = new Date('2023-04-01T14:00:00Z');
    //         ride.rider = new Rider();
    //         ride.rider.userId = '7b1d0312-37a2-4584-99e0-6ca22ecc1c53';
    //         (rideRepositoryMock.findOne as jest.Mock).mockResolvedValue(ride);
    //         (rideRepositoryMock.save as jest.Mock).mockResolvedValue(undefined);
    //         // Act
    //         const result = await rideService.finishRide(rideId);

    //         // Assert
    //         expect(rideRepositoryMock.findOne).toHaveBeenCalledWith({
    //             where: {
    //                 id: rideId
    //             },
    //             relations: ['rider']
    //         });
    //         expect(rideRepositoryMock.save).toHaveBeenCalledWith({
    //             id: ride.id,
    //             status: 'COMPLETED',
    //             dropoffTime: expect.any(Date),
    //             duration: expect.any(Number),
    //             distance: expect.any(Number),
    //             fare: expect.any(Number)
    //         });
    //         expect(eventEmitterMock.emit).toHaveBeenCalledWith('make.payment', expect.any(MakePaymentEvent));
    //         expect(result.message).toBe('Has finalizado el viaje.');
    //         expect(result.fare).toBeDefined();
    //         expect(result.pickupTime).toBe(ride.pickupTime);
    //         expect(result.dropoffTime).toBeDefined();
    //         expect(result.duration).toBeDefined();
    //     });
    // });
})
