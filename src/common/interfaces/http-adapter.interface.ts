export interface HttpAdapter {
    get<T>( url: string, config?: object ): Promise<T>;
    post<T>( url:string,data:object,config?: object): Promise<T>;
    delete<T>( url:string,config?: object): Promise<T>;
}