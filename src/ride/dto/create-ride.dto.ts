import { IsString, IsUUID, IsNumber, IsEmail, MinLength } from 'class-validator';

export class CreateRideDto {


    @IsString()
    @MinLength(4)
    pickupLocation:string;

    @IsString()
    @MinLength(4)
    dropOffLocation:string;

    @IsEmail()
    email:string;

}
