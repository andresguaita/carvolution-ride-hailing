import { IsString, IsUUID, IsNumber } from 'class-validator';

export class CreateTripDto {

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
