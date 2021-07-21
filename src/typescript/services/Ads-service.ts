interface ISpaceElement {
    width: number
    height: number
}

export class AdsService {
    public runAds(element: HTMLElement, space: ISpaceElement[]) {
        try {
            setTimeout(() => {
                let windowLib: any = window
                let _owAd: any = new windowLib.OwAd(element, space)

                _owAd.addEventListener('ow_internal_rendered', () => {
                   //  _owAd.refreshAd()
                });
            }, 1000);
        } catch(e) {
            console.error('error en el ads overwolf', e)
        }
    }
}