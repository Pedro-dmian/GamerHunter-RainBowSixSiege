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

                // ! responseSave.push(await this.savePrueba())

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

    public async savePrueba() {
        let json = {
            "id": 10,
            "name": "Game Demo",
            "description": "Game demo",
            "api_url": "https://api.statsdb.net/r6/",
            "api_key": "1698778424727938:f523104c4b5ccb36efa29c6b0e9c2dd7",
            "points_win": 0,
            "points_defeat": 0,
            "points_match": 0,
            "points_minute": 1,
            "points_experience": 0,
            "url_image": null,
            "active": 1,
            "icon_url": "",
            "deleted_at": null,
            "created_at": "2021-05-10 15:35:36",
            "updated_at": "2021-05-10 15:39:43",
            "img_help": null,
            "notes_game": null,
            "game_web": 0,
            "game_wolf": 1,
            "exist": true,
            "name_user": "Ezyh_",
            "points_user": 50,
            "name_button": "btnReloadPointsRainbowSix_10",
            "modal": "modalGameRainbowSix10",
            "brackground": "rainbowsix.png",
            "box_game": "rainbowsix.png",
            "icon": "rainbowsix.png",
            "user_id": 6,
            "challenges": {
                "data_challenge_1": {
                    "info_challenge": {
                        "id": 142,
                        "user_id": 6,
                        "cat_challenge_game_id": 102,
                        "is_started": 1,
                        "is_finished": 0,
                        "goal": 4,
                        "user_goal": 0,
                        "active": 1,
                        "datetime_finished": null,
                        "datetime_synchronization": "2021-05-11 18:37:24",
                        "deleted_at": null,
                        "created_at": "2021-05-11 18:37:24",
                        "updated_at": "2021-05-11 18:37:24",
                        "count_clic": 0,
                        "goal_current": 11,
                        "position_challenge": 1,
                        "cat_game_id": 9,
                        "coupon_id": null,
                        "percentage_goal": 0,
                        "cat_challenge_game": {
                            "id": 102,
                            "cat_game_id": 9,
                            "name": "Muralla",
                            "description": "Despliega 4 Barricadas",
                            "goal": 4,
                            "points_win": 10,
                            "img_url": null,
                            "active": 1,
                            "deleted_at": null,
                            "created_at": "2021-05-10 16:27:51",
                            "updated_at": "2021-05-10 16:27:51",
                            "cat_type_category_challenge_id": 58,
                            "challenge_boost": 0,
                            "initial_date": null,
                            "expiration_date": null,
                            "cat_type_category_challenge": {
                                "id": 58,
                                "name": "Obtener puntaje - Rainbow Six",
                                "description": "Obtener cierta cantidad de puntaje",
                                "active": 1,
                                "deleted_at": null,
                                "created_at": "2021-06-14 20:25:33",
                                "updated_at": "2021-06-14 20:25:33",
                                "image_url": "58_Obtener_puntaje.jpg",
                                "cat_game_id": 9,
                                "api_image_url": "https://v2.gamershunter.gg/images/challenges/58_Obtener_puntaje.jpg"
                            }
                        }
                    },
                    "error": false,
                    "msg": ""
                },
                "data_challenge_2": {
                    "info_challenge": {
                        "id": 141,
                        "user_id": 6,
                        "cat_challenge_game_id": 101,
                        "is_started": 1,
                        "is_finished": 0,
                        "goal": 4,
                        "user_goal": 1,
                        "active": 1,
                        "datetime_finished": null,
                        "datetime_synchronization": "2021-05-11 18:37:30",
                        "deleted_at": null,
                        "created_at": "2021-05-10 20:39:18",
                        "updated_at": "2021-05-11 18:37:30",
                        "count_clic": 2,
                        "goal_current": 4,
                        "position_challenge": 2,
                        "cat_game_id": 9,
                        "coupon_id": null,
                        "percentage_goal": 25,
                        "cat_challenge_game": {
                            "id": 101,
                            "cat_game_id": 9,
                            "name": "Curandero",
                            "description": "Revive 4 Aliados",
                            "goal": 4,
                            "points_win": 10,
                            "img_url": null,
                            "active": 1,
                            "deleted_at": null,
                            "created_at": "2021-05-10 16:27:10",
                            "updated_at": "2021-05-10 16:27:10",
                            "cat_type_category_challenge_id": 56,
                            "challenge_boost": 0,
                            "initial_date": null,
                            "expiration_date": null,
                            "cat_type_category_challenge": {
                                "id": 56,
                                "name": "Jugar partidas - Rainbow Six",
                                "description": "Jugar cierta cantidad de partidas",
                                "active": 1,
                                "deleted_at": null,
                                "created_at": "2021-06-14 20:25:33",
                                "updated_at": "2021-06-14 20:25:33",
                                "image_url": "55_Jugar_partidas.jpg",
                                "cat_game_id": 9,
                                "api_image_url": "https://v2.gamershunter.gg/images/challenges/55_Jugar_partidas.jpg"
                            }
                        }
                    },
                    "error": false,
                    "msg": ""
                },
                "error": false,
                "msg": "Challenges encontrados"
            },
            "api_brackground": "https://v2.gamershunter.gg/images/background_games/bg-gamecards/rainbowsix.png",
            "api_box_game": "https://v2.gamershunter.gg/images/background_games/box_games/rainbowsix.png",
            "api_icon": "https://image.flaticon.com/icons/png/512/1205/1205526.png"
        }

        await IndexDB.instance.save(this.objectStore, json)

        return json
    }
}