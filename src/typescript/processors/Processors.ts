// ? Libs
import axios, { AxiosRequestConfig, Method, AxiosError, AxiosResponse } from 'axios'

// ? Constant
import { webService, sessionStorage } from '../constants/consts'
import { Timings } from '../constants/timings'

import { Storage } from '../utils/Storage'

export class Processors {

    private static readonly MAX_ATTEMPTS: number = 3
    
    private readonly API_GATEWAY: string = webService.api
    private readonly API_PLATFORM: string = webService.platform

    public getAPI(path: string, method: Method = 'get', params: any = {}, attempts: number = 1): Promise<AxiosResponse> {
        let that = this

        return new Promise(async (resolve, reject) => {
            const token = new Storage().getItemLocalStorage(sessionStorage.token) || null

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
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

            if(!token) {
                delete axiosConfig.headers.Authorization
            }

            try {
                let requestAxios = await axios(axiosConfig)

                resolve(requestAxios)
            } catch(error: any) {
                reject(error)
            }
        })
    }

    private buildURL(path: string): string {
        return this.API_GATEWAY + this.API_PLATFORM + path
    }
}
