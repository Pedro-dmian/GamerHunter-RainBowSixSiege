export class Session {
    constructor () { }

    getItem<T> (itemName: string): T {
      const itemValue = sessionStorage.getItem(itemName)
      
      if (itemName) {
        return JSON.parse(itemValue)
      } else {
        return undefined
      }
    }
  
    setItem<T> (itemName: string, itemValue: T): void {
        sessionStorage.setItem(itemName, JSON.stringify(itemValue))
    }
  
    removeItem (itemName: string): void {
        sessionStorage.removeItem(itemName)
    }
  
    clearAllItems (): void {
        sessionStorage.clear()
    }   
}