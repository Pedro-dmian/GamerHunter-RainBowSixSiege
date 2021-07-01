import { Unsubscribable } from 'rxjs'

// ? Proccess
import { Processors } from '../processors/Processors'
import { IndexDB } from '../processors/IndexDB'

// ? Const
import { GameClassIdObject } from '../constants/consts'

// ? Services
import { ChallengesService } from '../services'

// ? Interface
import {
    IEvent,
    ISomeData,
    IShouldHighlightEvent
} from '../interfaces/IEvent'
import { IDataChallenge, IGameChallenge } from '../interfaces/IGameChallenge'

export class GameEventsService extends Processors {
    private objectStore = 'challenges'

    private constructor() {
        super();
    }

    public static get instance(): GameEventsService {
        if (!(<any>window).game_events_api) {
            (<any>window).game_events_api = new GameEventsService;
        }
        return (<any>window).game_events_api;
    }

    public setChallengerInGame(game_challenger: IGameChallenge, data: IEvent) : Promise<{ gameChallenger: IGameChallenge, error: boolean  }> {
        return new Promise(async (resolve, reject) => {
            try {
                let saveGameChallenges = await ChallengesService.instance.save(game_challenger)
                let save = await IndexDB.instance.save(this.objectStore, data)

                resolve({
                    gameChallenger: game_challenger,
                    error: true  
                })
            } catch(e) {
                resolve({
                    gameChallenger: null,
                    error: false
                })
            }
        })
    }

    public async sumOfChallenges(data: IEvent) : Promise<{ game_challenger: IGameChallenge, data: IEvent, foundAMatchInChallenger: boolean }> {
        let gameActive = await ChallengesService.instance.getGameByOverwolfID(data.overwolf_game_id).toPromise()
        let foundAMatchInChallenger = false

        if(!gameActive.challenges.error) {
            let challenger_one = gameActive.challenges.data_challenge_1.info_challenge || null
            let challenger_two = gameActive.challenges.data_challenge_2.info_challenge || null

            let cat_type_category_challenge_one = challenger_one?.cat_challenge_game?.cat_type_category_challenge?.id || 0
            let cat_type_category_challenge_two = challenger_two?.cat_challenge_game?.cat_type_category_challenge?.id || 0

            if(cat_type_category_challenge_one === data.cat_type_category_challenge) {
                let valueSum = (gameActive.challenges.data_challenge_1.info_challenge.amountIHave) ? gameActive.challenges.data_challenge_1.info_challenge.amountIHave : 0
                gameActive.challenges.data_challenge_1.info_challenge.amountIHave = valueSum + data.value

                foundAMatchInChallenger = true

                // ? Se encontro en la primer challenger
                data.Sync = 1
                data.completChallenge = (gameActive.challenges.data_challenge_1.info_challenge.amountIHave >= gameActive.challenges.data_challenge_1.info_challenge.goal) ? true : false
                data.challenge_id = gameActive.challenges.data_challenge_1.info_challenge.id
            }

            if(cat_type_category_challenge_two === data.cat_type_category_challenge) {
                // ? Se encontro en la primer challenger
                let valueSum = (gameActive.challenges.data_challenge_2.info_challenge.amountIHave) ? gameActive.challenges.data_challenge_2.info_challenge.amountIHave : 0
                gameActive.challenges.data_challenge_2.info_challenge.amountIHave = valueSum + data.value

                data.Sync = 1
                data.completChallenge = (gameActive.challenges.data_challenge_2.info_challenge.amountIHave >= gameActive.challenges.data_challenge_2.info_challenge.goal) ? true : false
                data.challenge_id = gameActive.challenges.data_challenge_2.info_challenge.id

                foundAMatchInChallenger = true
            }
        }

        return {
            game_challenger: gameActive,
            data,
            foundAMatchInChallenger
        }
    }

    public shouldHighlightEvent(e: any, game: IGameChallenge): IShouldHighlightEvent {
        let eventShort: IEvent = null

		let shouldHighlightEvent = e.events.some(event => {
            switch(game.overwolf_game_id) {
                case GameClassIdObject.RainbowSix:
                    eventShort = this.rainbowSixSiegeGameEvents(event, true, game.id)
                    break
            }

			if(!eventShort) {
				return false
			}

			return true
		})

        return { eventShort, shouldHighlight: shouldHighlightEvent }
    }

    public rainbowSixSiegeGameEvents(SomeData: any, isEvent: boolean = true, gameID: number): IEvent {
        const cat_game_id = gameID
        const overwolf_game_id = GameClassIdObject.RainbowSix

        let eventSelected: number = 0
        let eventsWithValues: IEvent = null

		if(isEvent) {
            /** 
             * ? Eventos los elementos en 0 no contienen una categoria
             * *                 |-Eventos    |- NombreEvento          |- Valor del evento
             * * FORMATO 🚀 { events: [ { name: 'defuser_planted', data: '' } ]}
             */

             const switchValuesEvents = {
                roundStart: 0,
                roundEnd: 0,
                roundOutcome: 54,
                matchOutcome: 55,
                kill: 53,
                headshot: 57,
                knockedout: 0,
                death: 0,
                killer: 0,
                defuser_planted: 0,
                defuser_disabled: 0
             }

            eventSelected = switchValuesEvents[SomeData.name] || 0

            if(eventSelected > 0) {
                const value = (typeof SomeData.data === 'number') ? SomeData.data : 1

                eventsWithValues = {
                    cat_type_category_challenge: eventSelected,
                    overwolf_game_id,
                    value,
                    cat_game_id,
                    Sync: 0,
                    completChallenge: false,
                    challenge_id: 0
                }
            }
		} else {
            /** 
             * ? Info Events
             * *                          |-Categoria    |- Key       |- Valor                  |- Categoria string
             * * FORMATO 🚀 {info: { match_info: { game_mode : 'THE_SELECTED_GAME_MODE' }}, feature: 'match_info'}
             */
             let informationBreakdown = this.informationBreakdownRainbowSixSiege(SomeData)

             const switchValuesInfoEvents = {
                gep_internal: 0,
                
                // ? game_info
                phase: 0,

                // ? match_info
                pseudo_match_id: 0,
                game_mode: 0,
                match_id: 0,
                map_id: 0,
                round_outcome_type: 56,

                // ? roster
                roster_XX: 0,
                team: 0,
                health: 0,
                score: 58,
                kills: 0,
                deaths: 0,
                operator: 0,
                
                // ? me
                name: 0,
                account_id: 1
             }

             eventSelected = switchValuesInfoEvents[informationBreakdown.key] || 0

             if(eventSelected > 0) {
                const value = (typeof informationBreakdown.data === 'number' || informationBreakdown.key === 'account_id') ? informationBreakdown.data : 1

                eventsWithValues = {
                    cat_type_category_challenge: eventSelected,
                    overwolf_game_id,
                    value,
                    cat_game_id,
                    Sync: 0,
                    completChallenge: false,
                    challenge_id: 0
                }
            }
		}

		return eventsWithValues
	}

    private informationBreakdownRainbowSixSiege(SomeData: any) {
        let eventSelectedInfo: { name: string, key: string, data: any } = {
            name: '',
            key: '',
            data: null
        }

        switch(SomeData.feature) {
            case 'gep_internal':
                eventSelectedInfo = {
                    name: SomeData.feature,
                    key: 'gep_internal',
                    data: SomeData.info[SomeData.feature].version_info
                }
                break
            case 'game_info':
                eventSelectedInfo = {
                    name: SomeData.feature,
                    key: 'phase',
                    data: SomeData.info[SomeData.feature].phase
                }
                break
            case 'match_info':
                let keyMatch = (Object.keys(SomeData.info[SomeData.feature])[0] || '')

                eventSelectedInfo = {
                    name: SomeData.feature,
                    key: keyMatch,
                    data: SomeData.info[SomeData.feature].game_mode || 
                    SomeData.info[SomeData.feature].pseudo_match_id || 
                    SomeData.info[SomeData.feature].match_id || 
                    SomeData.info[SomeData.feature].map_id || 
                    SomeData.info[SomeData.feature].round_outcome_type || 1
                }
                break
            case 'round':
                eventSelectedInfo = {
                    name: SomeData.feature,
                    key: 'number',
                    data: SomeData.info['round'].round || 1
                }
                break
            case 'match':
                eventSelectedInfo = {
                    name: SomeData.feature,
                    key: 'score',
                    data: SomeData.info[SomeData.feature].score
                }
                break
            case 'roster' || 'players':
                let key = (Object.keys(SomeData.info['players'])[0] || '')
                let keyNew = (Object.keys(SomeData.info['players'][key])[0] || '')

                eventSelectedInfo = {
                    name: SomeData.feature,
                    key: keyNew,
                    data: SomeData.info['players'][key][keyNew] || 1
                }
                break

            case 'me':
                let keyMe = (Object.keys(SomeData.info[SomeData.feature])[0] || '')
                
                eventSelectedInfo = {
                    name: SomeData.feature,
                    key: keyMe,
                    data: SomeData.info[SomeData.feature].name || 
                    SomeData.info[SomeData.feature].account_id || 1
                }
                break
        }

        return eventSelectedInfo
    }

    public showCongratulations(hidden: boolean = false) {
        if(!hidden) {
            document.getElementById('ContentCongratulations').style.visibility = 'visible'
            document.getElementById('ContentCongratulations').style.opacity = '1'
            document.getElementById('ContentCongratulations').style.zIndex = '100'
        } else {
            for (let index = 10; index >= 0; index--) {
                document.getElementById('ContentCongratulations').style.opacity = (index === 10) ? '1' : `0.${index}`
            }
            
            document.getElementById('ContentCongratulations').style.zIndex = '-1'
            document.getElementById('ContentCongratulations').style.visibility = 'hidden'
            
        }
    }
}