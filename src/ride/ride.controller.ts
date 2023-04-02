import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
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
  finish(@Body('rideId') RideId:number){
    return this.rideService.finishRide(RideId);
  }


}
