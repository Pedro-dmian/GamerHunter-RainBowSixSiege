// ? Interfaces
import { IMenu } from '../interfaces/IMenu.interface'

// ? Session user y contants
import { Storage } from '../utils/Storage'
import { sessionStorage } from '../constants/consts'
import { Utils } from '../utils/Utils'

export class NavAction {
    private TapAction = ''

    constructor() {
        $('body').on('click', '.nav-link', async (event) => {
            let currentTarget = event?.currentTarget?.id || 'tab-desktop'

            if(!currentTarget) {
                return;
            }

            let userSession = new Storage().getItemLocalStorage(sessionStorage.token) || null
            let Tag = this.getTabMenu(currentTarget)

            if(Tag.sessionRequired) {
                if(typeof userSession === 'undefined' || userSession === null) {
                    Tag = this.getTabMenu('tab-setting')

                    new Utils().toastr({ type: 'warning', message: 'Requieres de una sesión activa', iconClass: 'flaticon2-warning' })
                }
            }

            this.menuTabActive(Tag)
            this.TabActive(Tag)
        })
    }

    private menuTabActive(tag: IMenu) {
        if(!tag) {
            return
        }

        $('.nav-link').removeClass('active')
        $(tag.id).addClass('active')
    }

    private TabActive(tag: IMenu) {
        $('.tab-content').removeClass('d-block').addClass('d-none')
        $(tag.tag).removeClass('d-none').addClass('d-block')
    }

    private getTabMenu(tab: string = '') : IMenu {
        if(!tab) {
            return {  
                tag: '#tab-desktop-content',
                id: '#tab-desktop',
                window: 'desktop',
                index: 1,
                active: true,
                link: 'desktop.html',
                sessionRequired: false
            }
        }

        switch(tab) {
            case 'tab-desktop': 
                return {  
                    tag: '#tab-desktop-content',
                    id: '#tab-desktop',
                    window: 'desktop',
                    index: 1,
                    active: true,
                    link: 'desktop.html',
                    sessionRequired: false
                }
                break
            case 'tab-challenges': 
                return {
                    tag: '#tab-challenges-content',
                    id: '#tab-challenges',
                    window: 'challenges',
                    index: 2,
                    active: true,
                    link: 'challenges.html',
                    sessionRequired: true
                }
                break
            case 'tab-setting':
                return {
                    tag: '#tab-setting-content',
                    id: '#tab-setting',
                    window: 'setting',
                    index: 3,
                    active: true,
                    link: 'setting.html',
                    sessionRequired: false
                }
                break
        }
    }
}

