import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @Put('finish')
  finish(@Body('tripId') tripId:number){
    return this.tripService.finishTrip(tripId);
  }


}
