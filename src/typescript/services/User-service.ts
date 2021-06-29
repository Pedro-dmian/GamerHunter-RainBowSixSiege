// ? Process
import { Processors } from '../processors/Processors'

// ? Session y constantes
import { Storage } from '../utils/Storage'
import { sessionStorage, webService } from '../constants/consts'

import { IndexDB } from '../processors/IndexDB'

// ? Interfaces
import { IUser } from '../interfaces/IUser.interface'

export class UserService extends Processors {
    public objectStore: string = 'user'

    private constructor() {
        super()
    }

    public static get instance(): UserService {
        if (!(<any>window).user_api) {
            (<any>window).user_api = new UserService
        }
        return (<any>window).user_api
    }

    public listen(): void {
        this.setUserProfile()
    }

    public setUser(user: IUser): Promise<IUser> {
        return new Promise<IUser>(async (resolve, reject) => {
            try {
                let userSave = await new IndexDB().save(this.objectStore, user)

                resolve(userSave)
            } catch(error) {
                reject(error)
            }
        })
    }

    private setUserProfile() {
        let user : IUser = new Storage().getItemLocalStorage(sessionStorage.user) || null
        const pathImage : string = `${ webService.api }/storage/_avatars_/`
        
        const documents: any = {
            contentUser: $('.ContentComponentUserInformation') || null,
            user: $('.profile-username-content') || null,
            image: $('.profile-images-content') || null,
            coint: $('.profile-coint-content') || null,
            profileMenu: $('#tab-setting') || null
        }


        if(user) {
            $('#ContentComponentUserLogin').removeClass('d-none').addClass('d-block')

            if(documents.user) {
                documents.user.html(user.username_gh || '')
            }
    
            if(documents.image) {
                documents.image.attr('src', `${pathImage + user.avatar}` || './assets/img/default-user.png')
            }
    
            if(documents.coint) {
                documents.coint.html(`+ ${user.total_points}` || '+ 0')
            }

            if(documents.contentUser) {
                documents.contentUser.removeClass('d-none').addClass('d-flex')
            }

            if(documents.profileMenu) {
                documents.profileMenu.html(`<img src="${pathImage + user.avatar || './assets/img/default-user.png'} " alt="..." class="rounded-circle w-100">`)
            }

        } else {
            $('#ContentComponentUserLogin').removeClass('d-block').addClass('d-none')

            if(documents.contentUser) {
                documents.contentUser.removeClass('d-flex').addClass('d-none')
            }

            if(documents.profileMenu) {
                documents.profileMenu.html(`<i class="flaticon2-user icon-md"><span class="d-none">&nbsp;</span></i>`)
            }

            console.warn('No hay usuario disponible')
        }
    }
}