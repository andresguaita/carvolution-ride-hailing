import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { RideController } from './ride.controller';
import { RideService } from './ride.service';

describe('RideController', () => {
  let app: INestApplication;
  let rideService = { create: jest.fn(), finishRide: jest.fn() };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [RideService],
    })
      .overrideProvider(RideService)
      .useValue(rideService)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/POST ride', () => {
    const createRideDto = {
      pickupLocation: "chipre manizales",
      dropOffLocation: "clinica santillana",
      email: 'test@example.com',
    };
    return request(app.getHttpServer())
      .post('/ride')
      .send(createRideDto)
      .expect(201)
      .then(() => {
        expect(rideService.create).toHaveBeenCalledWith(createRideDto);
      });
  });

  it('/POST ride (invalid email)', () => {
    const createRideDto = {
      pickupLocation: "chipre manizales",
      dropOffLocation: "clinica santillana",
      email: 'invalid-email',
    };
    return request(app.getHttpServer())
      .post('/ride')
      .send(createRideDto)
      .expect(400);
  });

  it('/PUT ride/finish', () => {
    const rideId = 1;
    return request(app.getHttpServer())
      .put('/ride/finish')
      .send({ rideId })
      .expect(200)
      .then(() => {
        expect(rideService.finishRide).toHaveBeenCalledWith(rideId);
      });
  });

  it('/PUT ride/finish (missing rideId)', () => {
    return request(app.getHttpServer())
      .put('/ride/finish')
      .send({})
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});