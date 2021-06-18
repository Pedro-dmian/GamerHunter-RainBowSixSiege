import '../app'
import { AppWindow } from '../utils/AppWindow'
import { windowNames } from '../constants/consts'

import { NavAction } from '../utils/NavAction'
import { Utils } from '../utils/Utils'

// ? JQuery
import * as $ from 'jquery'

// ? Services
import { DesktopAPIService, LoginAPIService } from '../services'

// ? Interfaces
import { ILogin } from '../interfaces/ILogin.interface'

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

        this.startServices()
        this.eventsDesktop()
    }

    private startServices(): void {
        // DesktopAPIService.instance.listen()
    }

    private eventsDesktop() {
        this.formLogin()
    }

    public submit() {
        console.log('submit btn')
    }

    public formLogin() {
        this.UtilsClass.submitForm('formLogin', async (event) => {
            event.preventDefault()

            if(!this.UtilsClass.validateForm('formLogin')) {
                return this.UtilsClass.toastr({ type: 'warning', message: 'Faltan Campos en el formulario por contestar', iconClass: 'flaticon2-warning' })
            }

            // try {
            //     let data = await LoginAPIService.instance.login(this.UtilsClass.getFormData($('#formLogin')))
            //     console.log(data)
            // } catch(error) {
            //     console.log('error >>', error)
            // }
        })
    }
}

new DesktopController()