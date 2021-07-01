
import { Processors } from '../processors/Processors'

import { Storage } from '../utils/Storage'
import { localStorage } from '../constants/consts'

import { IImage } from '../interfaces/IImage'
import { ICoupon } from '../interfaces/ICoupon'
import { IGame } from '../interfaces/IGame'

export class CatalogsService extends Processors {
    private constructor() {
        super();
    }

    public static get instance(): CatalogsService {
        if (!(<any>window).catalogs_api) {
            (<any>window).catalogs_api = new CatalogsService;
        }
        return (<any>window).catalogs_api;
    }

    public listen(): Promise<{ images: IImage, coupons: ICoupon[], games: IGame[] }> {
        return new Promise(async (resolve, reject) => {
            try {
                let images = await this.getImages()
                let coupons = await this.getCoupons()
                let games = await this.getGames()

                resolve({
                    images, coupons, games
                })
            } catch(error)  {
                reject(error)
            }
        })
    }

    public getImages(): Promise<IImage> {
        return new Promise<IImage>(async (resolve, reject) => {
            try {
                let image = await (await this.getAPI('event_main', 'GET', null, 1)).data

                new Storage().setItemLocalStorage(localStorage.images, image.data.event)

                resolve(image.data.event)
            } catch(error) {
                console.log('error >>', error)
            
                reject(error)
            }
        })
    }

    public async getCoupons(): Promise<ICoupon[]> {
        return new Promise<ICoupon[]>(async (resolve, reject) => {
            try {
                let coupons = await (await this.getAPI('coupons', 'GET', null, 1)).data

                new Storage().setItemLocalStorage(localStorage.coupons, coupons.data.coupons)

                resolve(coupons.data.coupons)
            } catch(error) {
                reject(error)
            }
        })
    }

    public async getGames(): Promise<IGame[]> {
        return new Promise<IGame[]>(async (resolve, reject) => {
            try {
                let games = await (await this.getAPI('games', 'GET', null, 1)).data

                new Storage().setItemLocalStorage(localStorage.games, games.data.games)

                resolve(games.data.games)
            } catch(error) {
                reject(error)
            }
        })
    }
}