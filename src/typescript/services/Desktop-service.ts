
import { Processors } from '../processors/Processors'

import { Storage } from '../utils/Storage'
import { localStorage } from '../constants/consts'

export class DesktopService extends Processors {
    private constructor() {
        super();
    }

    public static get instance(): DesktopService {
        if (!(<any>window).desktop_api) {
            (<any>window).desktop_api = new DesktopService;
        }
        return (<any>window).desktop_api;
    }

    public async listen(): Promise<void> {   
    }
}