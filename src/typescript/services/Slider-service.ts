
import { Processors } from '../processors/Processors'

import 'owl.carousel'

export class SliderService extends Processors {
    private constructor() {
        super();
    }

    public static get instance(): SliderService {
        if (!(<any>window).slider_api) {
            (<any>window).slider_api = new SliderService;
        }
        return (<any>window).slider_api;
    }

    public listen(): void {
        this.startSliderDesktop()
    }

    private startSliderDesktop() {
        let element: any = $('.owl-carousel')

        element.owlCarousel({
            center: true,
            stagePadding: 0,
            items: 1,
            loop: true,
            margin: 0,
            singleItem: true,
            nav: true,
            navText: [
                "<i class='flaticon2-left-arrow'></i>",
                "<i class='flaticon2-right-arrow'></i>"
            ],
            dots: true,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true
        })   
    }
}