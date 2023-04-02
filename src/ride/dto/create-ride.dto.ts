import { IsString, IsUUID, IsNumber, IsEmail } from 'class-validator';

export class CreateRideDto {

    @IsNumber()
    pickupLat: number;
  
    @IsNumber()
    pickupLng:number;
  
    @IsNumber()
    dropoffLat: number;
  
    @IsNumber()
    dropoffLng: number;

    @IsEmail()
    email:string;

}
