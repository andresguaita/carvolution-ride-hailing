import { Test, TestingModule } from '@nestjs/testing';
import { RideController } from './Ride.controller';
import { RideService } from './Ride.service';

describe('RideController', () => {
  let controller: RideController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RideController],
      providers: [RideService],
    }).compile();

    controller = module.get<RideController>(RideController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
