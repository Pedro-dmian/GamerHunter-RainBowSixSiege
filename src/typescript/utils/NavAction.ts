// ? Interfaces
import { IMenu } from '../interfaces/IMenu.interface'

// ? JQuery
import * as $ from 'jquery'

export class NavAction {
    private TapAction = ''

    constructor() {
        $('body').on('click', '.nav-link', async (event) => {
            let currentTarget = event?.currentTarget?.id || 'tab-desktop'

            if(!currentTarget) {
                return;
            }

            let Tag = this.getTabMenu(currentTarget)

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
                link: 'desktop.html'
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
                    link: 'desktop.html'
                }
                break
            case 'tab-challenges': 
                return {
                    tag: '#tab-challenges-content',
                    id: '#tab-challenges',
                    window: 'challenges',
                    index: 2,
                    active: true,
                    link: 'challenges.html'
                }
                break
            case 'tab-setting':
                return {
                    tag: '#tab-setting-content',
                    id: '#tab-setting',
                    window: 'setting',
                    index: 3,
                    active: true,
                    link: 'setting.html'
                }
                break
        }
    }
}

