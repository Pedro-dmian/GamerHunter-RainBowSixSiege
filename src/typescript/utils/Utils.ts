import * as toastr from 'toastr'
import { isEmpty } from 'lodash'

import { OWHotkeys } from '@overwolf/overwolf-api-ts'

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

    public validarExistanceContentElement(id: string = '') : HTMLElement {
        const element: HTMLElement = document.getElementById(id)

        if(!id || !element) {
            this.toastr({ type: 'warning', message: 'El id del formulario esta vacío', iconClass: '' })

            return null
        }

        return element
    }

    public submitForm(formId: string = '', callback: any) : any {
        const element = this.validarExistanceContentElement(formId)

        if(!element) {
            return
        }

        element.addEventListener('submit', callback)
    }

    public submitEvent(id: string = '', callback: any) : any {
        const element = this.validarExistanceContentElement(id)

        if(!element) {
            return
        }

        element.addEventListener('click', callback)
    }

    public validateForm(formId: string = '') : boolean {
        const element: any = this.validarExistanceContentElement(formId)

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

    disabledButtonAndLoader(event, loader: boolean = true, spinnerColor: string = 'dark', messageAlert: string = '', clear: boolean = false, alertColor: string = 'danger', typeToastr: ToastrType = 'info') {
        if(!event) {
            this.toastr({ type: 'warning', message: 'El botton del formulario no esta completo o no esta definido', iconClass: '' })
        }

        if(loader) {
            if(event.submitter) {
                event.submitter.setAttribute('disabled', true)

                this.addClassContent(event.submitter.id, ['spinner', `spinner-${spinnerColor || 'dark'}`, 'spinner-right'])
            } else if(event.srcElement) {
                event.srcElement.setAttribute('disabled', true)

                this.addClassContent(event.srcElement.id, ['spinner', `spinner-${spinnerColor || 'dark'}`, 'spinner-right'])
            }
        } else {
            if(event.submitter) { 
                event.submitter.removeAttribute('disabled')

                this.addClassContent(event.submitter.id, [], ['spinner', `spinner-${spinnerColor || 'dark'}`, 'spinner-right'])
            }  else if(event.srcElement) {
                event.srcElement.removeAttribute('disabled')

                this.addClassContent(event.srcElement.id, [], ['spinner', `spinner-${spinnerColor || 'dark'}`, 'spinner-right'])
            }
        }

        this.setErrorForm(messageAlert, clear, alertColor, typeToastr, (event?.target?.id || null))
    }

    setErrorForm(messageAlert: string = '', clear: boolean = false, alertColor: string = 'danger', typeToastr: ToastrType = 'info', id: string = '') : any {
        let element = document.querySelector(`#${id} > #errorContent`) || null

        if(element) {
            if(clear) {
                element.innerHTML = ''    
            } else {
                element.innerHTML = `<div id="alertForm" class="alert alert-${alertColor}">${ messageAlert }</div>`
    
                this.toastr({ type: typeToastr, message: messageAlert, iconClass: '' })
            }
    
            return element
        }
    }

    addClassContent(id: string, classValue: any, classRemove: any = null) {
        let element: HTMLElement = document.getElementById(id)

        if(!this.validarExistanceContentElement(id)) {
            return null
        }

        if (!(classValue instanceof Array)) {
            classValue = [classValue]
        }

        if(classRemove != null) {
            if (!(classRemove instanceof Array)) {
                classRemove = [classRemove]
            }

            classRemove.forEach(itemClass => element.classList.remove(itemClass))
        }

        classValue.forEach(itemClass => element.classList.add(itemClass))

        return element 
    }

    openBrowser(url: string) {
        if(!isEmpty(url)) {
            overwolf.utils.openUrlInDefaultBrowser(url)
        }
    }
}