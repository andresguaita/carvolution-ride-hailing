
import { Injectable } from '@nestjs/common';
import { AxiosAdapter } from '../common/adapters/axios.adapter';
import { GeoLocationResponse } from './interfaces/geo-location-response.interface';


@Injectable()
export class GoogleMapsService {
  private readonly apiUrl = process.env.GOOGLE_API_URL;
  private readonly apiKey = process.env.GOOGLE_API_KEY;
  constructor(
    private readonly http: AxiosAdapter,
  ) { }

 public async findGeoLocation(address: string){

    try {
      const url = `${this.apiUrl}?address=${encodeURIComponent(address)}&key=${this.apiKey}`;

      console.log('URL', url)

      const geoLocation = await this.http.get<GeoLocationResponse>(url);
      
      return geoLocation;

    } catch (error) {
      console.log(error);
      throw new Error('Ha ocurrido un error inesperado, intente mas tarde.')
    }
  }
}
