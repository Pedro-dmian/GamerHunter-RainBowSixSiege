// ? App Inicial
import '../app'

import { AppWindow } from "../utils/AppWindow"

// ? OverWorlf
import { OWGamesEvents, OWHotkeys } from "@overwolf/overwolf-api-ts"

import { interestingFeatures, hotkeys, windowNames, GameClassId, ChallengeGame } from "../constants/consts"

import WindowState = overwolf.windows.WindowStateEx

// ? Challenges
import { ChallengesService } from '../services/Challenges-service'
import { ComponentsService } from '../services/Components-service'

// ? Controller

// ? Utils
import { Utils } from '../utils/Utils'

// ? Interfaces
import { IGameChallenge, IDataChallenge } from '../interfaces/IGameChallenge'

// * The window displayed in-game while a Fortnite game is running.
// * It listens to all info events and to the game events listed in the consts.ts file
// * and writes them to the relevant log using <pre> tags.
// * The window also sets up Ctrl+F as the minimize/restore hotkey.
// * Like the background window, it also implements the Singleton design pattern.
class InGame extends AppWindow {
	private static _instance: InGame
	private _GameEventsListener: OWGamesEvents
	private _eventsLog: HTMLElement
	private _infoLog: HTMLElement

	private UtilsClass: Utils

	private constructor() {
		super(windowNames.inGame)

		this._eventsLog = document.getElementById('eventsLog')
		this._infoLog = document.getElementById('infoLog')

		this.setToggleHotkeyBehavior()
		this.setToggleHotkeyText()
		
		this.UtilsClass = new Utils()

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

	public run() {
		this.getChallenges()
		this._GameEventsListener.start()
		this.formLinkAccount()
	}

	public async getChallenges() {
		try {
			await ChallengesService.instance.getGamesChallenges()
			let game: IGameChallenge = await ChallengesService.instance.getGameByOverwolfID(GameClassId).toPromise()
			
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
	
			ComponentsService.instance.EnabledFormLinkAccount(game)
		} catch(error) {
			console.log('error >>', error)
			console.log('error >>', error.message)
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

	private onInfoUpdates(info) {
		this.logLine(this._infoLog, info, false)
	}

  	// ? Special events will be highlighted in the event log
	private onNewEvents(e) {
		
		const shouldHighlight = e.events.some(event => {
			switch (event.name) {
				case 'gep_internal':
				case 'game_info':
					
					break
				case 'match':
				case 'match_info':
				case 'roster':
				case 'kill':
				case 'death':
				case 'me':
				case 'defuser':
					return true
			}

			return false
		})
		
		this.logLine(this._eventsLog, e, shouldHighlight)
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

	// ? Appends a new line to the specified log
	private logLine(log: HTMLElement, data, highlight) {
		console.log(log)
		console.log(data)
		/*
		const line = document.createElement('pre')
		
		line.textContent = JSON.stringify(data)

		if (highlight) {
			line.className = 'highlight'
		}

		const shouldAutoScroll = (log.scrollTop + log.offsetHeight) > (log.scrollHeight - 10)

		log.appendChild(line)

		if (shouldAutoScroll) {
			log.scrollTop = log.scrollHeight
		}
		*/
	}
}

InGame.instance().run()
