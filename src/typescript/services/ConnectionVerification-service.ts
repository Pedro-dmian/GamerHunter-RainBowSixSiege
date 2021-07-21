import { Utils } from '../utils/Utils'

export class ConnectionVerificationService {
    private constructor() { }

    public static get instance(): ConnectionVerificationService {
        if (!(<any>window).connectionVerification_api) {
            (<any>window).connectionVerification_api = new ConnectionVerificationService
        }
        return (<any>window).connectionVerification_api
    }

    connectionVerification(documentElement: string) {
        var isOnLine = navigator.onLine

        if (!isOnLine) {
            new Utils().toastr({ type: 'error', message: 'No tienes conexión a internet', iconClass: '' })

            new Utils().addClassContent(documentElement, ['d-flex'], ['d-none'])
        } else {
            new Utils().toastr({ type: 'success', message: 'Conexión correcta', iconClass: '' })
            
            new Utils().addClassContent(documentElement, ['d-none'], ['d-flex'])
        }
    }
}