import { PartialType } from '@nestjs/swagger';
import { CreateRideDto } from './create-Ride.dto';

export class UpdateRideDto extends PartialType(CreateRideDto) {}
