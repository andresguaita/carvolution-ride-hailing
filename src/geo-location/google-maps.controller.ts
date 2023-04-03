import { Controller, Get,Query } from "@nestjs/common";
import { GoogleMapsService } from "./google-maps.service";


@Controller('maps')
export class GoogleMapsController{

    constructor(
        private googleMapsService:GoogleMapsService
    ){

    }
    @Get('findGeoLocation')
    findGeoLocation(@Query('address') address:string){
        return this.googleMapsService.findGeoLocation(address);
    }
}