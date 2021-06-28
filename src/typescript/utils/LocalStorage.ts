export class LocalStorage {
	constructor () { }

    getItemLocalStorage<T> (itemName: string): Promise<T> {
		return new Promise((resolve, reject) => {
			const itemValue = localStorage.getItem(itemName)
      
			if (itemName) {
				return resolve(JSON.parse(itemValue))
			} else {
				return reject(reject)
			}
		})
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