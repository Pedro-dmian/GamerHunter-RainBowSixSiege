
import { Processors } from '../processors/Processors'

import { ILogin } from '../interfaces/ILogin.interface'

export class LoginService extends Processors {
    private constructor() {
        super();
    }

    public static get instance(): LoginService {
        if (!(<any>window).login_api) {
            (<any>window).login_api = new LoginService;
        }
        return (<any>window).login_api;
    }

    public listen(): void {
    }

    public async login(login: ILogin): Promise<any> {
        return await (await this.getAPI('login', 'POST', login, 1))
    }

    public async user(): Promise<any> {
        return await (await this.getAPI('user', 'GET'))
    }
}