
import { Processors } from '../processors/Processors'

export class DesktopAPIService extends Processors {
    private constructor() {
        super();
    }

    public static get instance(): DesktopAPIService {
        if (!(<any>window).desktop_api) {
            (<any>window).desktop_api = new DesktopAPIService;
        }
        return (<any>window).desktop_api;
    }

    public listen(): void {
        this.getData()
    }

    private async getData(): Promise<any> {
        let data = await (await this.getAPI('pokemon/ditto/dsjndjfndjg', 'GET', null, 1))

        console.log('data >>', data)
    }
}