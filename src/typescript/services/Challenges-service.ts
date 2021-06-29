import { Observable } from 'rxjs'

import { Processors } from '../processors/Processors'

import { IGameChallenge, ILinkAccount } from '../interfaces/IGameChallenge'

// ? Constantes
import { GameClassIdObject } from '../constants/consts'

// ? IndexDB
import { IndexDB } from '../processors/IndexDB'

export class ChallengesService extends Processors {
    private objectStore = 'games'

    private constructor() {
        super();
    }

    public static get instance(): ChallengesService {
        if (!(<any>window).challenges_api) {
            (<any>window).challenges_api = new ChallengesService;
        }
        return (<any>window).challenges_api;
    }

    public listen(): Promise<{ gamesChallenges: IGameChallenge[] }> {
        return new Promise(async (resolve, reject) => {
            try {
                let gamesChallenges = await this.getGamesChallenges()

                resolve({ gamesChallenges })
            } catch(error)  {
                reject(error)
            }
        })
    }

    public getGamesChallenges(): Promise<IGameChallenge[]> {
        return new Promise<IGameChallenge[]>(async (resolve, reject) => {
            try {
                let gamesChallenges = await (await this.getAPI('get_challenges', 'POST', null, 1)).data || []

                const games: IGameChallenge[] = gamesChallenges.data.games.map((game: IGameChallenge) => {
                    let attribute: string = (game.name || '').replace(' ', '')
                    game.overwolf_game_id = GameClassIdObject[attribute]

                    return game
                })

                let responseSave = await IndexDB.instance.save(this.objectStore, gamesChallenges.data.games)
                
                resolve(responseSave)
            } catch(error) {
                console.log('error >>', error)
            
                reject(error)
            }
        })
    }

    public getGameById(id: number): Observable<IGameChallenge> {
        return IndexDB.instance.getByPrimaryKey(this.objectStore, 'id', id)
    }

    public async linkAccount(data: ILinkAccount): Promise<any> {
        return await (await this.getAPI('connect_game', 'POST', data, 1))
    }

    public getGameByOverwolfID(overwolf_game_id: number) : Observable<IGameChallenge> {
        return IndexDB.instance.getByPrimaryKey(this.objectStore, 'overwolf_game_id', overwolf_game_id)
    }
}