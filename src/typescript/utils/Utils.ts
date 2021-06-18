import * as toastr from 'toastr'
import { isEmpty } from 'lodash'

export class Utils {
    public getFormData($form: any) : any {
        var unindexed_array = $form.serializeArray()
        var indexed_array = {}

        unindexed_array.map((n, i) => {
            indexed_array[n['name']] = n['value']
        })

        return indexed_array
    }

    public toastr(map: ToastMap) {
        if(!map.optionsOverride) {
            map.optionsOverride = {
                timeOut: 3000,
                positionClass: 'toast-bottom-center'
            }
        } else {
            map.optionsOverride.positionClass = 'toast-bottom-center'
        }

        return toastr[map.type](map.message, map.title, map.optionsOverride)
    }

    public validarExistanceConenteElement(formId: string = '') : HTMLElement {
        const element: HTMLElement = document.getElementById(formId)

        if(!formId || !element) {
            this.toastr({ type: 'warning', message: 'El id del formulario esta vacío', iconClass: '' })

            return 
        }

        return element
    }

    public submitForm(formId: string = '', callback: any) : any {
        const element = this.validarExistanceConenteElement(formId)

        if(!element) {
            return
        }

        element.addEventListener('submit', callback)
    }

    public validateForm(formId: string = '') : boolean {
        const element: any = this.validarExistanceConenteElement(formId)

        if(!element) {
            return
        }
        let stepForm : boolean = true
        const elementsHTML: any[] = Array.from(element.elements).filter((tag: any) => ['select', 'textarea', 'input'].includes(tag.tagName.toLowerCase()))

        elementsHTML.forEach(element => {
            const requireInput: boolean = element?.required || false
            const valueInput: any = element?.value || ''
            const nameInput: string = element?.name || '' 
            const parent = element?.parentNode || null
            let elementInnerHTML = parent?.querySelector('span.error-input') || null

            if(parent) {
                if(requireInput && isEmpty(valueInput)) {
                    if(!elementInnerHTML) {
                        let elementCreated: any = document.createElement('span')
    
                        elementCreated.className = 'form-text error-input text-danger'
    
                        parent.appendChild(elementCreated)
                    }
    
                    parent.querySelector('span.error-input').innerHTML = `Es campo ${ nameInput } es requerido.`
                
                    stepForm = false
                } else {
                    if(elementInnerHTML) {
                        elementInnerHTML.innerHTML = ''
                    }
                }
            }
        })

        return stepForm
    }


}
