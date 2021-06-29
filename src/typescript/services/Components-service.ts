
import { Processors } from '../processors/Processors'

// ? Storage y contantes
// import { Storage } from '../utils/Storage'
// import { localStorage } from '../constants/consts'

// ? Constants
import { ChallengeGame } from '../constants/consts'

// ? Lib
import { isEmpty } from 'lodash'

// ? Interfaces
import { IImage } from '../interfaces/IImage'
import { ICoupon } from '../interfaces/ICoupon'
import { IGameChallenge, IChallenge, IDataChallenge } from '../interfaces/IGameChallenge'

export class ComponentsService extends Processors {
    private constructor() {
        super();
    }

    public static get instance(): ComponentsService {
        if (!(<any>window).components_api) {
            (<any>window).components_api = new ComponentsService;
        }
        return (<any>window).components_api;
    }

    public getImageHTML(image: IImage): string {
        return `
        <div class="item" style="background-color: ${image.color_right}">
            <img src="${ image.banner_main }" alt="" class="w-100"/>
        </div>`
    }

    public getCouponsHTML(coupon: ICoupon): string {
        return `
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
            <button class="widget-3 widget-3-coupon w-100" data-url="${ coupon.url_store }">
                <div class="card card-custom card-stretch gutter-b bg-gamerhunter-secundary">
                    <div class="card-body d-flex align-items-center py-0 p-0 mt-0">
                        <img src="${ coupon.image_url }" alt="" class="align-self-center h-200px h-xl-200px">

                        <div class="d-flex flex-column flex-grow-1 p-2">
                            <p class="m-0 mb-2 text-white">
                                <small>${ coupon.name }</small>
                            </p>

                            <h5 class="font-bold card-title text-white mb-2">DAMAR BEAUTY</h5>
                            <span class="text-muted">
                                <small class="d-md-block d-none">
                                    ${ (coupon.description || '').substr(0, 80) + ((coupon.description) ? '...' : '')  }
                                </small>
                                <small class="d-md-none d-block">
                                    ${ (coupon.description || '').substr(0, 30) + ((coupon.description) ? '...' : '')  }
                                </small>
                            </span>
                            <span class="font-bold color-gamerhunter mt-2">${ coupon.date_since_format }</span>
                        </div>
                    </div>
                </div>
            </button>
        </div>`
    }

    public getGameList(game: IGameChallenge, index: number): string {
        return `
        <li class="position-relative list-game-tab ml-2 ${ (index === 0) ? 'active' : '' }" id="Btn-${ game.modal }">
            <img src="${ game.api_icon || './assets/img/not-imagen.jpg' }" alt="${ game.description }" class="w-100">
            <button class="btn-none btn-tab-games" data-tab="${ game.modal }" data-id="${ game.id }">
            </button>
        </li>`
    }

    public getChallengesGame(game: IGameChallenge, index: number, inGame: boolean = false) {
        let challenges: IChallenge = game.challenges
        let HTMLChallenges: string = `<div class="row content-challenges ${ (index === 0) ? 'd-flex' : 'd-none' }" id="${ game.modal }">`

        if(!challenges.error && game.exist) {
            // ? Limite de challengers Configurar en el const.ts

            for (let key = 1; key <= (ChallengeGame.limit || 2); key++) {
                const ChallengeData: IDataChallenge = challenges['data_challenge_' + key]
                
                if(typeof ChallengeData !== 'undefined') {
                    HTMLChallenges += `
                        <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                            <div class="card card-custom bg-gamerhunter-secundary">
                                <div class="card-body p-0">
                                    <div class="widget-1">
                                        <div class="widget-1-background" style="background-image: url('${ game.api_brackground }')">
                                            <!--<span class="widget-1-opacity"></span>-->
                                        </div>
                            
                                        <div class="row">
                                            <div class="col-4 position-relative">
                                                <div class="widget-1-image">
                                                    <span class="widget-1-circle">
                                                        <img src="${ ChallengeData.info_challenge.cat_challenge_game?.cat_type_category_challenge?.api_image_url || './assets/img/not-imagen.jpg' }" alt="">
                                                    </span>
                                                    <span class="widget-1-circle-range"></span>
                                                </div>
                                            </div>
                                            <div class="col-8 position-relative">
                                                <div class="d-block mt-5">
                                                    <h6>${ ChallengeData.info_challenge.cat_challenge_game?.name }</h6>
                                                    <p class="mt-2">
                                                        ${ ChallengeData.info_challenge.cat_challenge_game?.description }
                                                    </p>
                                                </div>
                            
                                                <div class="d-flex align-items-center w-100 flex-fill mt-lg-8 mt-8">
                                                    <div class="progress progress-xs mx-3 w-100">
                                                        <div class="progress-bar bg-gamerhunter" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                    </div>
                                                </div>
                            
                                                <div class="row">
                                                    <div class="col-6 d-flex justify-content-start">
                                                        <span class="font-weight-bolder text-white ml-2">${ '0' }</span>
                                                    </div>
                            
                                                    <div class="col-6 d-flex justify-content-end">
                                                        <span class="font-weight-bolder text-white mr-2">${ ChallengeData.info_challenge.goal || 0 }</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                }
            }
        } else {
            HTMLChallenges = `
                <div class="row content-challenges justify-content-center ${ (index === 0) ? 'd-flex' : 'd-none' }" id="${ game.modal }">
                    <div class="col-8 col-sm-9 col-md-5">
                        <div class="alert alert-warning">
                            <p class="font-bold p-0 text-center d-block m-0">${ challenges.msg || 'Error al cargar datos del juego' }</p>
                            <h6 class="font-bold text-dark p-0 text-center d-block m-0">${ 'Ingresa a ' + game.name + ' para vincular automáticamente' }</h6>
                        </div>
                    </div>
            `
        }

        if(inGame) {
            HTMLChallenges = ''
        } else {
            HTMLChallenges += '</div>'
        }

        return HTMLChallenges
    }

    private makeID(length: number = 10): string {
        let result           = ''
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charactersLength = characters.length
        
        for (let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }

        return result
    }

    public EnabledFormLinkAccount(game: IGameChallenge) {
        let FormLinkAccout = document.getElementById('ContentComponentLinkAccount') || null

        if(!FormLinkAccout) {
            return null
        }

        if(!game.exist) {
            FormLinkAccout.classList.remove('d-none')
            FormLinkAccout.classList.add('d-flex')

            let svgIcon = document.getElementById('iconSVGFormLinlAccount') || null
            let inputGameID: any = document.getElementById('game_id') || null
            let inputUsername = document.getElementById('gameUsername') || null

            if(!isEmpty(game.api_icon)) {
                if(svgIcon) {
                    svgIcon.classList.remove('d-none')
                    svgIcon.classList.add('d-flex')
                }

                document.getElementById('imageFormGameRelationship').setAttribute('src', game.api_icon)
            } else {
                if(svgIcon) {
                    svgIcon.classList.remove('d-flex')
                    svgIcon.classList.add('d-none')
                }
            }

            if(inputGameID) {
                inputGameID.value = game.id
            }

            if(inputUsername) {
                inputUsername.setAttribute('placeholder', `Username ${ game.name }`)
            }
        } else {
            FormLinkAccout.classList.remove('d-flex')
            FormLinkAccout.classList.add('d-none')
        }
    }
}