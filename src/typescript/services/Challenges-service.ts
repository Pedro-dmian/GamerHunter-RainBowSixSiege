import { Observable } from 'rxjs'

import { Processors } from '../processors/Processors'

import { IChallenge, IDataChallenge, IGameChallenge, ILinkAccount } from '../interfaces/IGameChallenge'
import { IUser } from '../interfaces/IUser.interface'

// ? Constantes
import { GameClassIdObject, sessionStorage } from '../constants/consts'

// ? IndexDB
import { IndexDB } from '../processors/IndexDB'
import { IEvent } from '../interfaces/IEvent'

// ? Localtion
import { Storage } from '../utils/Storage'

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

    public getGamesChallenges(saveIndex: boolean = true): Promise<IGameChallenge[]> {
        return new Promise<IGameChallenge[]>(async (resolve, reject) => {
            try {
                let gamesChallenges = await (await this.getAPI('get_challenges', 'POST', null, 1)).data || []
                let savedGamesAll = await this.getGamesAll().toPromise()
                let userData: IUser = new Storage().getItemLocalStorage(sessionStorage.user) || null

                let challenger1Complet: boolean = false
                let challenger2Complet: boolean = false

                let games: IGameChallenge[] = gamesChallenges.data.games.map((game: IGameChallenge) => {
                    let savedGames = savedGamesAll.find(item => (item.id === game.id && item.user_id === userData.id))

                    let attribute: string = (game.name || '').replace(' ', '')
                    game.overwolf_game_id = GameClassIdObject[attribute]

                    if(!game.challenges.error) {
                        let amountIHave_1 = 0
                        let amountIHave_2 = 0

                        if(typeof savedGames !== 'undefined') {
                            if(!savedGames.challenges.error) {
                                if((savedGames.challenges?.data_challenge_1?.info_challenge?.id || 0) === game.challenges.data_challenge_1.info_challenge.id) {
                                    amountIHave_1 =  savedGames.challenges?.data_challenge_1?.info_challenge?.amountIHave || 0

                                    challenger1Complet = this.challengerComplet(amountIHave_1, savedGames.challenges?.data_challenge_1)
                                }

                                if((savedGames.challenges?.data_challenge_2?.info_challenge?.id || 0) === game.challenges.data_challenge_2.info_challenge.id) {
                                    amountIHave_2 =  savedGames.challenges?.data_challenge_2?.info_challenge?.amountIHave || 0

                                    challenger2Complet = this.challengerComplet(amountIHave_2, savedGames.challenges?.data_challenge_2)
                                }
                            }
                        }

                        game.challenges.data_challenge_1.info_challenge.amountIHave = amountIHave_1
                        game.challenges.data_challenge_2.info_challenge.amountIHave = amountIHave_2
                    }

                    return game
                })

                for (const game of games) {
                    if(challenger1Complet && userData.id) {
                        await this.completeChallenge({ user_goal: userData.id, challenge_user_id: game.challenges.data_challenge_1.info_challenge.id })
                    }
    
                    if(challenger2Complet && userData.id) {
                        await this.completeChallenge({ user_goal: userData.id, challenge_user_id: game.challenges.data_challenge_2.info_challenge.id })
                    }   
                }

                if(saveIndex) {
                    await IndexDB.instance.save(this.objectStore, gamesChallenges.data.games)
                }

                if(challenger1Complet || challenger2Complet) {
                    games = await this.getGamesChallenges()
                }
                
                resolve(games)
            } catch(error) {
                reject(error)
            }
        })
    }

    public async remplaceChallengerComplet(data: IEvent): Promise<IGameChallenge[]> {
        return new Promise<IGameChallenge[]>(async (resolve, reject) => {
            try {
                let gamesChallenges: IGameChallenge[] = await this.getGamesChallenges(false)
                let GameFind = gamesChallenges.find(item => item.id === data.cat_game_id) 

                if(!GameFind.challenges.error) {
                    let challengerNotCompletRestoureInfo: IDataChallenge = await this.challengerNotCompletRestoureInfo(data, GameFind)

                    if(challengerNotCompletRestoureInfo != null) {
                        if(GameFind.challenges.data_challenge_1.info_challenge.id === challengerNotCompletRestoureInfo.info_challenge.id) {
                            GameFind.challenges.data_challenge_1 = challengerNotCompletRestoureInfo
                        }

                        if(GameFind.challenges.data_challenge_2.info_challenge.id === challengerNotCompletRestoureInfo.info_challenge.id) {
                            GameFind.challenges.data_challenge_2 = challengerNotCompletRestoureInfo
                        }
                    }
                }

                let remplaceChallenges = await IndexDB.instance.save(this.objectStore, GameFind)

                resolve(remplaceChallenges)
            } catch(e) {
                reject(e)
            }
        })
    }

    private async challengerNotCompletRestoureInfo(data: IEvent, game: IGameChallenge) : Promise<IDataChallenge> {
        let challenger: IDataChallenge = null

        let challengetsLocal: IGameChallenge = await this.getGameByOverwolfID(game.overwolf_game_id).toPromise()

        let challengerLocal_1 = challengetsLocal.challenges.data_challenge_1 || null
        let challengerLocal_2 = challengetsLocal.challenges.data_challenge_2 || null

        if(challengerLocal_1.info_challenge.id === data.challenge_id) {
            challenger = challengerLocal_2
        } else if(challengerLocal_2.info_challenge.id === data.challenge_id) {
            challenger = challengerLocal_1
        }

        return challenger
    }

    public getGameById(id: number): Observable<IGameChallenge> {
        return IndexDB.instance.getByPrimaryKey(this.objectStore, 'id', id)
    }

    public getGamesAll(): Observable<IGameChallenge[]> {
        return IndexDB.instance.getAll(this.objectStore)
    }

    public async linkAccount(data: ILinkAccount): Promise<any> {
        return await (await this.getAPI('connect_game', 'POST', data, 1))
    }

    public getGameByOverwolfID(overwolf_game_id: number) : Observable<IGameChallenge> {
        return IndexDB.instance.getByPrimaryKey(this.objectStore, 'overwolf_game_id', overwolf_game_id)
    }

    public save(data: any) : Promise<IGameChallenge> {
        return IndexDB.instance.save(this.objectStore, data)
    }

    public async completeChallenge(data: { challenge_user_id: number, user_goal: number }): Promise<any> {
        return await (await this.getAPI('complete_challenge', 'POST', data, 1))
    }

    public async delete() {
        return await IndexDB.instance.cleanStore(this.objectStore)
    }

    private challengerComplet(AmountIHave: number, data_challenge: IDataChallenge) : boolean {
        if(data_challenge.error) {
            return false
        }

        if(AmountIHave >= data_challenge.info_challenge.goal) {
            return true
        } else {
            return false
        }
    }
}