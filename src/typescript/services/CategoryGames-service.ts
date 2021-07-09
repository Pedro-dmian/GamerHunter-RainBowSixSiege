
import { Processors } from '../processors/Processors'

import {  ICategorieGame } from '../interfaces/IGame'

import { IndexDB } from '../processors/IndexDB'

export class CategoryGameService extends Processors {
    public objectStore = 'games_categories'

    private constructor() {
        super();
    }

    public static get instance(): CategoryGameService {
        if (!(<any>window).category_game_api) {
            (<any>window).category_game_api = new CategoryGameService;
        }
        return (<any>window).category_game_api;
    }

    public listen(): Promise<{ categoriesGame: ICategorieGame[] }> {
        return new Promise(async (resolve, reject) => {
            try {
                let categoriesGame = await this.getCategoriesGame()

                resolve({
                    categoriesGame
                })
            } catch(error)  {
                reject(error)
            }
        })
    }

    public async getCategoriesGame(): Promise<ICategorieGame[]> {
        return new Promise<ICategorieGame[]>(async (resolve, reject) => {
            try {
                let categoriesGame = await (await this.getAPI('categories_game', 'GET', null, 1)).data

                let games_categories = await IndexDB.instance.save(this.objectStore, categoriesGame.data.games)

                resolve(categoriesGame.data.games)
            } catch(error) {
                reject(error)
            }
        })
    }

    public async getCategoriesWhereByID(id: number) : Promise<ICategorieGame> {
        return await IndexDB.instance.getDataWhere(this.objectStore, 'id', id).toPromise()
    }

    public async delete() {
        return await IndexDB.instance.cleanStore(this.objectStore)
    }
}