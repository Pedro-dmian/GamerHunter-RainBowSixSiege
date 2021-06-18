//import * as request from 'request'
// ? Libs
import axios, { AxiosRequestConfig, Method, AxiosError, AxiosResponse } from 'axios'

// ? Constant
import { webService } from '../constants/consts'
import { Timings } from '../constants/timings'


export class Processors {

    private static readonly MAX_ATTEMPTS: number = 3
    
    private readonly API_GATEWAY: string = webService.api
    private readonly API_PLATFORM: string = webService.platform

    public getAPI(path: string, method: Method = 'get', params: any = {}, attempts: number): Promise<AxiosResponse> {
        let that = this

        return new Promise(async (resolve, reject) => {
            const headers = { 
                Authorization: `Bearer ${'token'}`,
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
                'Content-Type': 'application/json', 
                'X-Requested-With': 'XMLHttpRequest'
            } as AxiosRequestConfig

            let axiosConfig: AxiosRequestConfig = {
                url: this.buildURL(path),
                data: params,
                method,
                headers
            }

            if(method === 'get' || method === 'GET') {
                delete axiosConfig.data
            }

            if(true) {
                delete axiosConfig.headers.Authorization
            }

            try {
                let requestAxios = await axios(axiosConfig)

                resolve(requestAxios)
            } catch(error: any) {
                reject(error)
            }
        })

        /*if (attempts < Processors.MAX_ATTEMPTS) {
            
        } else {
            debugger
            setTimeout(() => {
                that.getAPI(path, method,  params, attempts + 1)
            }, Timings.MINUTE * Timings.TIMEOUT_SECOND )
        }*/
    }

    private buildURL(path: string): string {
        return this.API_GATEWAY + this.API_PLATFORM + path
    }
}
