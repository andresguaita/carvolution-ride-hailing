import { Controller, Get, Post, Body, Put, ParseIntPipe } from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';


@Controller('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  create(@Body() createRideDto: CreateRideDto) {
    return this.rideService.create(createRideDto);
  }

  @Put('finish')
  finish(@Body('rideId', ParseIntPipe) rideId:number){
    return this.rideService.finishRide(rideId);
  }


}
