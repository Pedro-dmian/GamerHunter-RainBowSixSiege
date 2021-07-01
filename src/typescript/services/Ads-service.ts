export class AdsService {
    public runAds(element: HTMLElement) {
        try {
            setTimeout(() => {
                let _owAd: any = new OwAd(element, [{ width:300, height:250 }])

                _owAd.addEventListener('ow_internal_rendered', () => {
                   //  _owAd.refreshAd()
                });
            }, 1000);
        } catch(e) {
            console.error('error en el ads overwolf', e)
        }
    }
}