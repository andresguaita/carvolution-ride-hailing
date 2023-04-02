import { IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateRideDto {

    @IsNumber()
    pickupLat: number;
  
    @IsNumber()
    pickupLng:number;
  
    @IsNumber()
    dropoffLat: number;
  
    @IsNumber()
    dropoffLng: number;

    @IsUUID()
    riderId:string;

}
