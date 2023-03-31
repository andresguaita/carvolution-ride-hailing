import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpAdapter } from './../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private axios: AxiosInstance = axios;

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {

            const {data,config:config1} = await this.axios.get<T>( url, config );
            return data;

        } catch (error) {
            //console.log(error.response.status); // imprime el código de estado de la respuesta de error
            //console.log(error.response.data); // imprime la data de la respuesta de error
            console.log(error.response.data);
            throw new Error('Hubo un error al realizar la solicitud');
        }

    }

    async post<T>(url:string,body:object | string,config?: AxiosRequestConfig){

        try {
            const { data,config:config1 } = await this.axios.post<T>(url, body,config)

            return data;

        } catch (error) {
            /* console.log(error.response.status); // imprime el código de estado de la respuesta de error
            console.log(error.response.data); // imprime la data de la respuesta de error
            console.log(error.response.url); // imprime el path de la respuesta de error */
            
           console.log('RESPUESTA API',error);

            throw new Error('Hubo un error al realizar la solicitud');
        }
    }

    async delete<T>(url:string,config?: AxiosRequestConfig){

        try {

            const { data,config:config1 } = await this.axios.delete<T>(url,config)
            return data;

        } catch (error) {
            //console.log(error.response.status); // imprime el código de estado de la respuesta de error
            //console.log(error.response.data); // imprime la data de la respuesta de error
            //console.log(error.response.url); // imprime el path de la respuesta de error
            console.log(error);

            throw new Error('Hubo un error al realizar la solicitud');
        }
    }

}
