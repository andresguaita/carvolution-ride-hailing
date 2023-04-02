import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { CreateRideDto } from './dto/create-ride.dto';
import { MakePaymentEvent } from './events/make-payment.event';


describe('Ride Controller', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/rides (POST)', () => {
    it('should create a ride', () => {
      const createRideDto: CreateRideDto = {
        pickupLat: 123.456,
        pickupLng: 789.123,
        dropoffLat: 456.789,
        dropoffLng: 321.987,
        email: 'test@example.com',
      };

      return request(app.getHttpServer())
        .post('/rides')
        .send(createRideDto)
        .expect(201);
    });
  });

  describe('/rides/:id/payments (POST)', () => {
    it('should make a payment for a ride', () => {
      const makePaymentEvent: MakePaymentEvent = {
        userId: '123',
        fare: 50,
        rideId: 1,
      };

      return request(app.getHttpServer())
        .post('/rides/1/payments')
        .send(makePaymentEvent)
        .expect(201);
    });
  });

  describe('/rides (GET)', () => {
    it('should get a list of rides', () => {
      return request(app.getHttpServer()).get('/rides').expect(200);
    });
  });

  describe('/rides/:id (GET)', () => {
    it('should get a ride by id', () => {
      return request(app.getHttpServer()).get('/rides/1').expect(200);
    });
  });

  describe('/health-check (GET)', () => {
    it('should return a health check', () => {
      return request(app.getHttpServer()).get('/health-check').expect(200);
    });
  });
});