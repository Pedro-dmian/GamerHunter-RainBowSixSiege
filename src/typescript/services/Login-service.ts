
import { Processors } from '../processors/Processors'

import { ILogin } from '../interfaces/ILogin.interface'

export class LoginAPIService extends Processors {
    private constructor() {
        super();
    }

    public static get instance(): LoginAPIService {
        if (!(<any>window).login_api) {
            (<any>window).login_api = new LoginAPIService;
        }
        return (<any>window).login_api;
    }

    public listen(): void {
    }

    public async login(login: ILogin): Promise<any> {
        return await (await this.getAPI('login', 'POST', login, 1))
    }
}