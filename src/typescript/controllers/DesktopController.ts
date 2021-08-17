import '../app'
import { AppWindow } from '../utils/AppWindow'
import { windowNames, sessionStorage, localStorage } from '../constants/consts'

import { NavAction } from '../utils/NavAction'
import { Utils } from '../utils/Utils'

// ? Lib
import { isEmpty } from 'lodash'

// ? Services
import {
    LoginService,
    UserService,
    CatalogsService,
    ComponentsService,
    ChallengesService,
    CategoryGameService,
    AdsService,
    ConnectionVerificationService
} from '../services'

// ? Interfaces
import { IImage } from '../interfaces/IImage'
import { ICoupon } from '../interfaces/ICoupon'
import { IGameChallenge, IChallenge } from '../interfaces/IGameChallenge'

// ? Storage
import { Storage } from '../utils/Storage'

// ? IndexDB
import { IndexDB } from '../processors/IndexDB'
import { ICategorieGame } from '../interfaces/IGame'

export class DesktopController {
    public FILE: string = 'tab-desktop'

    private UtilsClass: Utils

    constructor() {
        new NavAction()

        new AppWindow(windowNames.desktop)
        new IndexDB().main()
        new AdsService().runAds(document.getElementById("ad-div"), [ { width: 345, height: 500 } ])
        this.main()
    }

    private async main() {
        this.UtilsClass = new Utils()

        this.UtilsClass.loaderInWindow(true)

        window.onload = (e) => ConnectionVerificationService.instance.connectionVerification('connectionAlert')

        await this.startServices()

        // ! Cargar Events NOTA::::LOS EVENTOS SE TIENEN QUE CARGAR UNA SOLA VEZ
        this.eventsDesktop()
    }

    private async startServices(): Promise<void> {
        const token: string = new Storage().getItemLocalStorage(sessionStorage.token)
        let isSession: boolean = (isEmpty(token)) ? false : true

        if(isSession) {
            this.UtilsClass.addClassContent('ContentComponentLogin', ['d-none'], ['d-flex'])
        } else {
            this.UtilsClass.addClassContent('ContentComponentLogin', ['d-flex'], ['d-none'])
        }

        // ? UserLog
        UserService.instance.listen()

        // ? Start functions
        await this.getSliderImages()
        await this.getCoupons()
        await this.getGames()

        this.UtilsClass.loaderInWindow(false)
    }

    private eventsDesktop() {
        this.formLogin()
        // this.formLinkAccount()
        this.signOff()
        this.openURL()
        this.TabActive()
    }

    private formLogin() {
        this.UtilsClass.submitForm('formLogin', async (event) => {
            event.preventDefault()

            this.UtilsClass.disabledButtonAndLoader(event, true, null, null, true)

            if(!this.UtilsClass.validateForm('formLogin')) {
                return this.UtilsClass.toastr({ type: 'warning', message: 'Faltan Campos en el formulario por contestar', iconClass: 'flaticon2-warning' })
            }

            try {
                let { data } = await LoginService.instance.login(this.UtilsClass.getFormData($('#formLogin')))
                
                // new Storage().setItem(sessionStorage.token, data.access_token)
                new Storage().setItemLocalStorage(sessionStorage.token, data.access_token)

                let { data: user } = await LoginService.instance.user()

                new Storage().setItemLocalStorage(sessionStorage.user, user)
                //new Storage().setItem(sessionStorage.user, user)
                await UserService.instance.setUser(user)
                
                this.UtilsClass.disabledButtonAndLoader(event, false, null, 'Cargando datos del usuario.', false, 'success', 'success')

                this.startServices()
            } catch(error) {
                console.log('error >>', error)

                let message: string = ''

                if(error.response) {
                    message = error.response?.data?.message || 'Error en el logín intentar más tarde'
                }

                this.UtilsClass.disabledButtonAndLoader(event, false, null, message, false, 'danger', 'error')
            }
        })
    }

    private signOff() {
        this.UtilsClass.submitEvent('signOff', async (event) => {
            this.UtilsClass.disabledButtonAndLoader(event, true, '', '', true)

            CategoryGameService.instance.delete()
            ChallengesService.instance.delete()
            UserService.instance.delete()

            // ? Clear LocalStorage SessionStorage
            new Storage().clearAllItems()
            new Storage().clearAllItemsLocalStorage()

            this.startServices()

            setTimeout(() => this.UtilsClass.disabledButtonAndLoader(event, false, 'Success', 'success', true), 2000)
        })
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

                this.getGames()

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

    private openURL() {
        let buttons = document.querySelectorAll('.widget-3-coupon')

        const URLEventOPEN = (event) => {
            this.UtilsClass.toastr({ type: 'success', message: 'Se abrira en un momento en tu navegador', iconClass: 'flaticon2-warning' })

            let URL: string = event.currentTarget?.getAttribute('data-url') || ''

            if(!isEmpty(URL)) {
                return this.UtilsClass.openBrowser(URL)
            }

            return this.UtilsClass.toastr({ type: 'warning', message: 'La url del cupón no esta definida correctamente', iconClass: 'flaticon2-warning' })
        }

        buttons.forEach((button) => button.addEventListener('click', URLEventOPEN))
    }

    private TabActive() : NodeListOf<Element> {
        let buttons = document.querySelectorAll('.btn-tab-games')

        const toDisableTab = () => {
            let Tabs = document.querySelectorAll('.content-challenges') || []
            let TabButtons = document.querySelectorAll('.list-game-tab') || []

            Tabs.forEach(tab => {
                tab?.classList?.remove('d-flex')
                tab?.classList?.add('d-none')
            })
            TabButtons.forEach(TabButton => TabButton?.classList?.remove('active'));
        }

        const enableTab = (tab) => {
            let TabActive = document.getElementById(tab) || null
            let btnTabActive = document.getElementById(`Btn-${tab}`) || null

            if(TabActive) {
                TabActive.classList.remove('d-none')
                TabActive.classList.add('d-flex')
            }

            if(btnTabActive) {
                btnTabActive.classList.add('active')
            }
        }

        const eventFunction = async (event) => {
            let TAB: string = event.currentTarget?.getAttribute('data-tab') || ''
            let gameID = parseInt(event.currentTarget?.getAttribute('data-id')) || 0
            
            if(gameID > 0) {
                const gameChallenge: IGameChallenge = await ChallengesService.instance.getGameById(gameID).toPromise()

                if(typeof gameChallenge != 'undefined') {
                    ComponentsService.instance.EnabledFormLinkAccount(gameChallenge)
                } else {
                    this.UtilsClass.toastr({ type: 'warning', message: 'El game no esta disponible.', iconClass: 'flaticon2-warning' })

                    return 
                }
            }

            if(!isEmpty(TAB)) {
                toDisableTab()
                enableTab(TAB)
                
                return
            }

            this.UtilsClass.toastr({ type: 'warning', message: 'El game no encuentra sus challenges intentar más tarde.', iconClass: 'flaticon2-warning' })

            return
        }

        buttons.forEach((button) => button.addEventListener('click', eventFunction))

        return buttons
    }

    private getSliderImages(): Promise<boolean> {
        return new Promise(async (resolve) => {
            let alertNotImage: HTMLElement = document.getElementById('notImagen')
            let element: HTMLElement = document.getElementById('SliderOWL')

            try {
                let image: IImage = await CatalogsService.instance.getImages()

                if(image) {
                    if(element) {
                        element.innerHTML = ComponentsService.instance.getImageHTML(image)
                    }

                    if(alertNotImage) {
                        alertNotImage.classList.add('d-none')
                    }
                } else {
                    if(alertNotImage) {
                        alertNotImage.classList.remove('d-none')
                    }
                }

                resolve(true)
            } catch(error) {
                let message: string = 'No hay imagenes disponibles'
                console.log(message)

                if(alertNotImage) {
                    alertNotImage.classList.remove('d-none')
                }

                resolve(false)
            }
        })
    }

    private getCoupons(): Promise<boolean> {
        return new Promise(async (resolve) => {
            let couponsElements: HTMLElement = document.getElementById('Coupons')
            let contenteComponentCouponsElement: HTMLElement = document.getElementById('ContenteComponentCoupons')

            try {
                let coupons: ICoupon[] = await CatalogsService.instance.getCoupons()
                let HTMLCoupons : string = ''

                if(coupons) {
                    coupons.forEach(coupon => HTMLCoupons += ComponentsService.instance.getCouponsHTML(coupon))

                    couponsElements.innerHTML = HTMLCoupons
                    contenteComponentCouponsElement.classList.remove('d-none')
                }

                resolve(true)
            } catch(error) {
                let message: string = 'No hay Coupons disponibles'
                console.log(message)
                
                if(contenteComponentCouponsElement) {
                    contenteComponentCouponsElement.classList.add('d-none')
                }

                resolve(false)
            }
        })
    }

    private getGames(): Promise<boolean> {
        return new Promise(async (resolve) => {
            let contenteComponentElement: HTMLElement = document.getElementById('ContentComponentGamerHunter')
            let GamesElements: HTMLElement = document.getElementById('GamesList')
            let ChallengesElement: HTMLElement = document.getElementById('tooglesBody')

            try {
                let getCategoriesGame: ICategorieGame[] = await CategoryGameService.instance.getCategoriesGame()
                let gamesChallenges: IGameChallenge[] = await ChallengesService.instance.getGamesChallenges()
                
                let HTMLGames : string = ''
                let ChallengerToggleTab: string = ''

                console.log('gamesChallenges >> ', gamesChallenges)

                if(gamesChallenges) {
                    if(gamesChallenges.length >= 0) {
                        gamesChallenges.forEach((game, index) => {
                            HTMLGames += ComponentsService.instance.getGameList(game, index)
    
                            ChallengerToggleTab += ComponentsService.instance.getChallengesGame(game, index)
    
                            if(index === 0) {
                                ComponentsService.instance.EnabledFormLinkAccount(game)
                            }
                        })
                    } else {
                        ChallengerToggleTab = `
                            <div class="alert alert-warning">    
                                <p class="font-bold p-0 text-center d-block m-0">No hay challenges disponibles</p>
                            </div>
                        `
                    }

                    GamesElements.innerHTML = HTMLGames
                    ChallengesElement.innerHTML = ChallengerToggleTab
                    contenteComponentElement.classList.remove('d-none')
                }

                resolve(true)
            } catch(error) {
                console.log('error >>', error)

                let message: string = 'No hay juegos disponibles'
                console.log(message)
                contenteComponentElement.classList.add('d-none')
                resolve(false)
            }
        })
    }
}

new DesktopController()