// ? App Inicial
import '../app'

// ? Windows App
import { AppWindow } from "../utils/AppWindow"

// ? Const
import {
	interestingFeatures,
	hotkeys,
	windowNames,
	GameClassId,
	ChallengeGame,
	sessionStorage
} from "../constants/consts"

// ? OverWorlf
import { 
	OWGamesEvents, 
	OWHotkeys
} from "@overwolf/overwolf-api-ts"

import WindowState = overwolf.windows.WindowStateEx

// ? Services
import { 
	ChallengesService,
	ComponentsService,
	GameEventsService,
	UserService,
	AdsService
} from '../services'

// ? Lib
import { isEmpty } from 'lodash'

// ? Utils
import { Utils } from '../utils/Utils'
import { Storage } from '../utils/Storage'

// ? Interfaces
import { IGameChallenge } from '../interfaces/IGameChallenge'
import { IEvent } from '../interfaces/IEvent'

class InGame extends AppWindow {
	private static _instance: InGame
	private _GameEventsListener: OWGamesEvents
	
	private UtilsClass: Utils
	private GameInformation: IGameChallenge
	private enteredEvents: number = 0
	private user_id: number = 0

	private constructor() {
		super(windowNames.inGame)

		// ? Toggle Buttons
		this.setToggleHotkeyBehavior()
		this.setToggleHotkeyText()
		
		this.UtilsClass = new Utils()

		this.user_id = new Storage().getItemLocalStorage(sessionStorage.user).id || 0

		new AdsService().runAds(document.getElementById("ad-div"))

		this._GameEventsListener = new OWGamesEvents({
			onInfoUpdates: this.onInfoUpdates.bind(this),
			onNewEvents: this.onNewEvents.bind(this)
		}, interestingFeatures)
	}

	public static instance() {
		if (!this._instance) {
			this._instance = new InGame()
		}

		return this._instance;
	}

	public async run() {
		let isloggedIn = UserService.instance.isLoggedIn(document.getElementById('alertPageInGame') || null, document.getElementById('ChallengesBody') || null)

		if(!isloggedIn) {
			return console.warn('No hay un usuario activo')
		}

		// ? getChallenges
		await this.getChallenges()

		this._GameEventsListener.start()

		// ? Eventos Forms
		this.mainEvents()
	}

	private mainEvents() {
		this.formLinkAccount()
		
	}
	
	private async onInfoUpdates(info) {
		console.log('info >>', JSON.stringify(info))

		let eventsWithValues = GameEventsService.instance.rainbowSixSiegeGameEvents(info, false, this.GameInformation.id)

		await this.logLine(eventsWithValues, false)
	}

  	// ? Special events will be highlighted in the event log
	private async onNewEvents(e) {
		console.log('event >>', JSON.stringify(e))

		let shouldHighlightEvent = GameEventsService.instance.shouldHighlightEvent(e, this.GameInformation)

		await this.logLine(shouldHighlightEvent.eventShort)
	}

	// ? Appends a new line to the specified log
	private async logLine(data: IEvent, isEvent: boolean = true) {
		try {
			this.enteredEvents++

			if(data) {
				// ? Verificar si el usuario tiene vinculada su cuenta
				if(!this.GameInformation.exist) {
					if(data.cat_type_category_challenge === 1) {
						this.synchronizeAccount(data.value || null)
					}

					return 
				}

				let { game_challenger, data: data_challenge, foundAMatchInChallenger } = await GameEventsService.instance.sumOfChallenges(data)
				

				// ? Se encontro coincidencia en un challenger y se actualizo su valor
				if(data_challenge.Sync > 0 && foundAMatchInChallenger) {
					const syncChallengerFromGame = await GameEventsService.instance.setChallengerInGame(game_challenger, data_challenge)
					const setChallengerInGame = await GameEventsService.instance.setChallengerInGame(game_challenger, data_challenge)
				}

				if(data_challenge.completChallenge) {
					GameEventsService.instance.showCongratulations()

					// ? Mandar informacion del challenger
					let challengerSeend = await ChallengesService.instance.completeChallenge({ user_goal: this.user_id, challenge_user_id: data.challenge_id })

					if(challengerSeend) {
						await ChallengesService.instance.remplaceChallengerComplet(data)
					}

					await this.challengerContentRefresh(data.overwolf_game_id)

					GameEventsService.instance.showCongratulations(true)

					this.UtilsClass.toastr({ type: 'success', message: (challengerSeend.data.data.msg || 'Challenge completado. Se te han asignado tus hunter coins correspondientes.'), iconClass: 'flaticon2-check' })
				}

				if(data_challenge.Sync > 0) {
					this.challengerContentRefresh(data.overwolf_game_id)
				}
			}
		} catch(e) {
			console.log(e)
		}
	}

	private async challengerContentRefresh(overwolf_game_id) {
		let game = await ChallengesService.instance.getGameByOverwolfID(overwolf_game_id).toPromise()

		this.challengerContent(game)
	}

  	// ? Displays the toggle minimize/restore hotkey in the window header
	private async setToggleHotkeyText() {
		const hotkeyText = await OWHotkeys.getHotkeyText(hotkeys.toggle, GameClassId)

		console.log(hotkeyText)
		//const hotkeyElem = document.getElementById('hotkey')
		//hotkeyElem.textContent = hotkeyText
	}

	// ? Sets toggleInGameWindow as the behavior for the Ctrl+F hotkey
	private async setToggleHotkeyBehavior() {
		const toggleInGameWindow = async (hotkeyResult: overwolf.settings.hotkeys.OnPressedEvent): Promise<void> => {
			console.log(`pressed hotkey for ${hotkeyResult.name}`)
			
			const inGameState = await this.getWindowState()

			if (inGameState.window_state === WindowState.NORMAL || inGameState.window_state === WindowState.MAXIMIZED) {
				this.currWindow.minimize()
			} else if (inGameState.window_state === WindowState.MINIMIZED || inGameState.window_state === WindowState.CLOSED) {
				this.currWindow.restore()
      		}
		}

		OWHotkeys.onHotkeyDown(hotkeys.toggle, toggleInGameWindow)
	}

	private synchronizeAccount(id: any) {
		let account_id: string = id || null
		let inputAccountId: any = document.getElementById('account_id') || null

		let elementMessageAccount = document.getElementById('messageLinkAccount') || null
		let elementModalGame = document.querySelectorAll('.content-challenges .alert')[0] || null
		let elementFormSynchronizeAccount: any = document.getElementById('linkAccount_submit') || null

		if(!isEmpty(account_id)) {
			if(inputAccountId) {
				inputAccountId.value = account_id

				if(elementFormSynchronizeAccount) {
					elementFormSynchronizeAccount.click()
				}

				return 
			}
		}

		if(this.enteredEvents > ChallengeGame.synchronizeAccountRetriesLimit) {
			if(elementMessageAccount) {
				elementMessageAccount.classList.add('d-none')
			}
	
			if(elementModalGame) {
				elementModalGame.classList.remove('alert-warning')
				elementModalGame.classList.add('alert-danger')
				elementModalGame.innerHTML = `<p class="font-bold p-0 text-center d-block m-0">No se puede sincronizar en este momento, intenta cerrar y volver abrir el juego</p>`
			}
	
			return this.UtilsClass.toastr({ type: 'warning', message: 'No se puede sincronizar en este momento', iconClass: 'flaticon2-warning' })	
		} else {
			console.info(`Aún no se obtiene el account_id reintentos restantes ${ ChallengeGame.synchronizeAccountRetriesLimit - this.enteredEvents }`)
		}
	}

	private formLinkAccount() {
        this.UtilsClass.submitForm('formLinkAccount', async (event) => {
            event.preventDefault()
            
            this.UtilsClass.disabledButtonAndLoader(event, true, null, null, true)

            if(!this.UtilsClass.validateForm('formLinkAccount')) {
                return this.UtilsClass.toastr({ type: 'warning', message: 'Faltan Campos en el formulario por contestar', iconClass: 'flaticon2-warning' })
            }

            try {
                let { data } = await ChallengesService.instance.linkAccount(this.UtilsClass.getFormData($('#formLinkAccount')))

				this.getChallenges()

                this.UtilsClass.disabledButtonAndLoader(event, false, null, data.msg || 'Se vínculo correctamente', false, 'success', 'success')
            } catch(error) {
                let message: string = ''

                if(error.response) {
                    message = error.response?.data?.data?.msg || 'Error al vincular tu cuenta intentar más tarde'
                }

                this.UtilsClass.disabledButtonAndLoader(event, false, null, message, false, 'danger', 'error')
            }
        })
    }

	public getChallenges() : Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			try {
				await ChallengesService.instance.getGamesChallenges()
				let game: IGameChallenge = await ChallengesService.instance.getGameByOverwolfID(GameClassId).toPromise()
				
				this.challengerContent(game)
		
				ComponentsService.instance.EnabledFormLinkAccount(game)

				this.GameInformation = game

				resolve(true)
			} catch(error) {
				console.log('error >>', error)
				console.log('error >>', error.message)
				reject(false)
			}
		})
	}

	public challengerContent(game: IGameChallenge) {
		let HTMLChallenges = ComponentsService.instance.getChallengesGame(game, 0, true)
		let HTMLElement = document.getElementById('ChallengesBody')

		if(HTMLElement) {
			HTMLElement.innerHTML = HTMLChallenges
		}

		let ElementAlert = document.getElementById(game.modal)

		if(ElementAlert) {
			if(!game.exist) {
				ElementAlert.classList.add('mt-5')
				ElementAlert.classList.add('mb-0')
			} else {
				ElementAlert.classList.remove('mt-5')
				ElementAlert.classList.remove('mb-0')
			}
		}
	}

	private FuncionDePrueba() {
		return [
			[
				
			],
			[
				
			]
			// { info:{ 'me': { 'account_id': '1b810848-34df-4834-aa26-61c838059a37' }}, 'feature': 'me' },
			// {"info":{"gep_internal":{"version_info":{"local_version":"157.0.1","public_version":"157.0.1","is_updated":true}}},"feature":"gep_internal"},
			// {"info":{"game_info":{"phase":"operator_select"}}, "feature":"game_info"},
			// {"info":{"match_info":{"game_mode":"THE_SELECTED_GAME_MODE"}},"feature":"match_info"},
			// {"info":{"match":{"score":{"blue":"2","orange":"1"}}},"feature":"match"},
			// {"info":{"players":{"roster_0":{"name":"WolfOnTop.top","is_local":"1","team":"1","operator":"0","kills":"0","headshots":"0","deaths":"0","score":"0","defuser":"0","health":"0"}}},"feature":"roster"},
			// {"info":{"players":{"roster_0":{"kills": 0 }}},"feature":"roster"},
			// {"info":{"players":{"roster_0":{"headshots": 0 }}},"feature":"roster"},
		]
		//return { events: [ { name: 'kill', data: 1 } ]}
	}
}

InGame.instance().run()
