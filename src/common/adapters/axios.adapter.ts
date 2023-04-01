import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { HttpAdapter } from './../interfaces/http-adapter.interface';

@Injectable()
export class AxiosAdapter implements HttpAdapter {

    private axios: AxiosInstance = axios;

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {

            const { data, config: config1 } = await this.axios.get<T>(url, config);
            return data;

        } catch (error) {
            const errorMessage = error.response.data.message || JSON.stringify(error.response.data);
            throw new Error(errorMessage);
        }

    }

    async post<T>(url: string, body: object | string, config?: AxiosRequestConfig) {
        try {
            const { data, config: config1 } = await this.axios.post<T>(url, body, config)
            return data;
        } catch (error) {
            const errorMessage = error.response.data.message || JSON.stringify(error.response.data);
            throw new Error(errorMessage);
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig) {
        try {
            const { data, config: config1 } = await this.axios.delete<T>(url, config)
            return data;
        } catch (error) {
            const errorMessage = error.response.data.message || JSON.stringify(error.response.data);
            throw new Error(errorMessage);
        }
    }

}
