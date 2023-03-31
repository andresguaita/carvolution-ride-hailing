import { IsString, IsUUID } from "class-validator";

export class CreateTripDto {

    @IsString()
    pickupLat: string;
  
    @IsString()
    pickupLng: string;
  
    @IsString()
    dropoffLat: string;
  
    @IsString()
    dropoffLng: string;

    @IsUUID()
    riderId:string;

}
