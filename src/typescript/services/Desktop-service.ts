
import { Processors } from '../processors/Processors'

import { Session } from '../utils/Session'
import { sessionStorage } from '../constants/consts'

export class DesktopService extends Processors {
    private constructor() {
        super();
    }

    public static get instance(): DesktopService {
        if (!(<any>window).desktop_api) {
            (<any>window).desktop_api = new DesktopService;
        }
        return (<any>window).desktop_api;
    }

    public async listen(): Promise<void> {
        try {
            let Images = await this.getImagesSlider()
            let Coupons = await this.getCoupons()
            let Games = await this.getGames()
            let CategoriesGame = await this.getCategoriesGame()

            new Session().setItem(sessionStorage.images, Images.data.data.event)
            new Session().setItem(sessionStorage.coupons, Coupons.data.data.coupons)
            new Session().setItem(sessionStorage.games, Games.data.data.games)
            new Session().setItem(sessionStorage.categoriesGame, CategoriesGame.data.data.games)
        } catch(error)  {
            console.log('error >>', error)
        }
    }

    private async getImagesSlider(): Promise<any> {
        return await (await this.getAPI('event_main', 'GET', null, 1))
    }

    private async getCoupons(): Promise<any> {
        return await (await this.getAPI('coupons', 'GET', null, 1))
    }

    private async getGames(): Promise<any> {
        return await (await this.getAPI('games', 'GET', null, 1))
    }

    private async getCategoriesGame(): Promise<any> {
        return await (await this.getAPI('categories_game', 'GET', null, 1))
    }
}