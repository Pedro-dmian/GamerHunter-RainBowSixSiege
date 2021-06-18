import { LaunchSourceService } from "./LaunchSource-service";
import { windowNames } from "../constants/consts";

export class Wrapper {

    public restore(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.restore(name, (result: any) => {
                    if (result.status === 'success') {
                        resolve();
                    } else {
                        reject(result);
                    }
                });
            } catch (e) {
                reject(e)
            }
        });
    }

    public close(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.close(name, (result) => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public hide(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.hide(name, (result) => {
                    resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public sendToBack(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.sendToBack(name, (result: any) => {
                    if (result.status === 'success') {
                        resolve();
                    } else {
                        reject(result);
                    }
                });
            } catch (e) {
                reject(e)
            }
        });
    }

    public position(name: string, left: number, top: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.changePosition(name, left, top, (result: any) => {
                    if (result.status === 'success') {
                        resolve();
                    } else {
                        reject(result);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public maximize(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.maximize(name, (result: any) => {
                    if (result.status === 'success') {
                        resolve();
                    } else {
                        reject(result);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public size(name: string, width: number, height: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.changeSize(name, width, height, (result: any) => {
                    if (result.status === 'success') {
                        resolve();
                    } else {
                        reject(result);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    
    public _getCurrentWindow(): Promise<any> {
        return new Promise((resolve, reject) => {
            overwolf.windows.getCurrentWindow((result: any) => {
                if (result.status === 'success') {
                    resolve(result.window);
                } else {
                    reject(result);
                }
            });
        });
    }

    public _obtainWindow(name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                overwolf.windows.obtainDeclaredWindow(name, (response: any) => {
                    if (response.status !== 'success') {
                        return reject(response);
                    }
                    resolve(response);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public minimize(name: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.minimize(name, (result:any) => {
                    if (result.status === 'success') {
                        resolve();
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public getWindowState(name: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._obtainWindow(name);
                overwolf.windows.getWindowState(name, (result: any) => {
                    if (result.status === 'success') {
                        resolve(result);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public closeListener(gameChange: boolean): void {
        if (!gameChange) {
            window.close();
        }
    }
}
