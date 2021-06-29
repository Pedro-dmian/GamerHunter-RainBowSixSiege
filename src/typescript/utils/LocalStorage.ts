export class LocalStorage {
	constructor () { }

    getItemLocalStorage<T> (itemName: string): any {
		const itemValue = localStorage.getItem(itemName)
      
		if (itemName) {
			return JSON.parse(itemValue)
		} else {
			return null
		}
    }
  
    setItemLocalStorage<T> (itemName: string, itemValue: T): void {
		localStorage.setItem(itemName, JSON.stringify(itemValue))
    }
  
    removeItemLocalStorage (itemName: string): void {
		localStorage.removeItem(itemName)
    }
  
    clearAllItemsLocalStorage (): void {
		localStorage.clear()
    }
}