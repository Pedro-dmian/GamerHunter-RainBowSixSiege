import '../app'
import { AppWindow } from '../utils/AppWindow'
import { windowNames, sessionStorage } from '../constants/consts'

import { NavAction } from '../utils/NavAction'
import { Utils } from '../utils/Utils'

// ? Lib
import { isEmpty } from 'lodash'

// ? Services
import { DesktopService, LoginService, UserService, SliderService } from '../services'

// ? Interfaces
import { ILogin } from '../interfaces/ILogin.interface'

import { Session } from '../utils/Session'

export class DesktopController {
    public FILE: string = 'tab-desktop'

    private UtilsClass: Utils

    constructor() {
        new NavAction()

        // The desktop window is the window displayed while GamePlay is not running.
        // In our case, our desktop window has no logic - it only displays static data.
        // Therefore, only the generic AppWindow class is called.
        new AppWindow(windowNames.desktop)
        this.start()
    }

    private async start() {
        this.UtilsClass = new Utils()

        this.sliderImages()
        this.startServices()
        this.eventsDesktop()
    }

    private startServices(): void {
        const token: string = new Session().getItem('token')
        let isSession: boolean = (isEmpty(token)) ? false : true

        if(isSession) {
            this.UtilsClass.addClassContent('ContentComponentLogin', ['d-none'], ['d-flex'])
        } else {
            this.UtilsClass.addClassContent('ContentComponentLogin', ['d-flex'], ['d-none'])
        }
    
        UserService.instance.listen()
        SliderService.instance.listen()
        DesktopService.instance.listen()
    }

    private eventsDesktop() {
        this.formLogin()
        this.signOff()
    }

    public formLogin() {
        this.UtilsClass.submitForm('formLogin', async (event) => {
            event.preventDefault()

            this.UtilsClass.disabledButtonAndLoader(event, true, null, null, true)

            if(!this.UtilsClass.validateForm('formLogin')) {
                return this.UtilsClass.toastr({ type: 'warning', message: 'Faltan Campos en el formulario por contestar', iconClass: 'flaticon2-warning' })
            }

            try {
                let { data } = await LoginService.instance.login(this.UtilsClass.getFormData($('#formLogin')))
                
                new Session().setItem(sessionStorage.token, data.access_token)

                let { data: user } = await LoginService.instance.user()

                new Session().setItem(sessionStorage.user, user)
                
                this.UtilsClass.disabledButtonAndLoader(event, false, null, 'Cargando datos del usuario.', false, 'success', 'success')

                this.startServices()
            } catch(error) {
                let message: string = ''

                if(error.response) {
                    message = error.response?.data?.message || 'Error en el logín intentar más tarde'
                }

                this.UtilsClass.disabledButtonAndLoader(event, false, null, message, false, 'danger', 'error')
            }
        })
    }

    public signOff() {
        this.UtilsClass.submitEvent('signOff', async (event) => {
            this.UtilsClass.disabledButtonAndLoader(event, true, '', '', true)

            new Session().clearAllItems()

            this.startServices()

            setTimeout(() => this.UtilsClass.disabledButtonAndLoader(event, false, 'Success', 'success', true), 2000)
        })
    }

    public sliderImages() {
        let images: any[] = [new Session().getItem(sessionStorage.images)] || []

        let element = $('#SliderOWL')

        if(images) {
            element.removeClass('d-none').empty()

            images.forEach(item => {
                element.append(`
                    <div class="item">
                        <img src="${ item.banner_main }" alt="" />
                    </div>
                `)
            })
        } else {
            element.addClass('d-none').empty()
        }
    }
}

new DesktopController()