import Dexie from 'dexie'
import { Observable } from 'rxjs'

// ? Lib
import { isEmpty } from 'lodash'

// ? Constantes
import { indexDB as indexDBConst } from '../constants/consts'

interface IwhereCondition {
    where: string,
    value: any
}

export class IndexDB {
    public db: any;

    constructor() {
        this.makeDatabase()
        this.connectToDatabase()
    }

    public static get instance(): IndexDB {
        if (!(<any>window).indexDB_api) {
            (<any>window).indexDB_api = new IndexDB;
        }
        return (<any>window).indexDB_api;
    }

    public main() : void {
        console.log('initial DB: ', indexDBConst.database)
    }
    
    public makeDatabase() : void {
        this.db = new Dexie(indexDBConst.database)
        
        this.db.version(1).stores({
            games: 'id, Sync, overwolf_game_id',
            user: 'id, Sync',
            challenges: '++id, cat_type_category_challenge, cat_game_id, overwolf_game_id, Sync',
            games_categories: 'id, [id+categories.id]'
        })
    }
    
    connectToDatabase(): void {
        this.db.open().catch((error) => {
            alert(`Errod during connecting to database: ${ error }`)
        })
    }

    public async save(objectStore, elements) : Promise<any> {
        if (!(elements instanceof Array)) {
            elements = [elements]
        }
    
        return new Promise(async (resolve, reject) => {
            if (!objectStore || isEmpty(objectStore)) {
                reject(new Error('La tabla no fue seleccionada'))
            }
    
            try {
                const store = this.db[objectStore]
                const returnDexie = await this.db.transaction('rw', store, () => elements.forEach(item => {
                    item.Sync = (typeof item.Sync === 'undefined') ? 1 : ((item.Sync) ? item.Sync : 0) 
                    
                    store.put(item)
                }))
    
                resolve(elements)
            } catch (e) {
                reject(e)
            }
        })
    }
    
    public async saveAll(objectStore, object, replace) : Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (Array.isArray(object) === true && object.length === 0) {
                resolve(0)
            }
      
            if (Array.isArray(object) === false) {
                object = [object];
            }
      
            let inserts = object.length;

            try {
                const store = this.db[objectStore]
            
                const returnDexie = await this.db.transaction('rw', store, () => object.forEach(item => {
                    if(replace) {
                        store.add(item)
                    } else {
                        store.put(item)
                    }
                }))
    
                resolve(inserts)
            } catch (e) {
                reject(e)
            }
        })
    }
    
    public getAll(objectStore) : Observable<any> {
        return new Observable((observer) => {
            if (!objectStore || isEmpty(objectStore)) {
                observer.error('La tabla no fue seleccionada')
            }
    
            this.db[objectStore].toArray().then(items => {
                observer.next(items)
                observer.complete()
            }, error => observer.error(error))
        })
    }
    
    public getDataWhere(objectStore, key, value)  : Observable<any> {
        return new Observable((observer) => {
            if (!objectStore || isEmpty(objectStore)) {
                observer.error('La tabla no fue seleccionada')
            }
    
            const store: any = this.db[objectStore]
    
            this.db.transaction('r', store, async () => {
                return await store.where(key || 'id').equals(value).toArray()
            }).then(values => {
                observer.next(values)
                observer.complete()
            }).catch(e => observer.error(e))
        })
    }
    
    public getObject(objectStore, key) : Observable<any> {
        return new Observable((observer) => {
            if (!objectStore || isEmpty(objectStore)) {
                observer.error('La tabla no fue seleccionada')
            }
    
            const store: any = this.db[objectStore]
    
            this.db.transaction('r', store, async () => {
                const values = await store.get(key)
    
                return values
            }).then(values => {
                observer.next(values)
                observer.complete()
            }).catch(e => observer.error(e))
        })
    }
    
    public getByPrimaryKey(objectStore, key, value) : Observable<any> {
        return new Observable((observer) => {
            if (!objectStore || isEmpty(objectStore)) {
                observer.error('La tabla no fue seleccionada')
            }

            const store: any = this.db[objectStore]
    
            this.db.transaction('r', store, async () => {
                const values = await store.where(key || 'id').equals(value).first()
                
                return values
            }).then((values) => {
                observer.next(values)
                observer.complete()
            }).catch(e => {
                observer.error(e)
            })
        })
    }
    
    public markSynchronized(objectStore, key, value, Sync) : Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                let itemData: any = await this.getDataWhere(objectStore, key, value).toPromise()
                let objectSaveItem = []
    
                if(itemData.length > 0) {
                    itemData.forEach((item) => {
                        item.Sync = Sync ? 1 : 0
                    
                        objectSaveItem.push(item)
                    })
                }
    
                this.save(objectStore, objectSaveItem).then(response => {
                    resolve(itemData)
                }, error => {
                    reject(error)
                })
            } catch(error) {
                debugger
        
                reject(error)
            }
        })
    }
    
    public dialSynchronized(objectStore, object: any, value) {
        if ((object instanceof Array)) {
            object.map((items : any) => {
                items.Sync = value ? 1 : 0
            })
        } else {
            object.Sync = value ? 1 : 0
        }
    
        return this.save(objectStore, object)
    }
    
    public cleanStore(objectStore) : Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (!objectStore || isEmpty(objectStore)) {
                reject(new Error('La tabla no fue seleccionada'))
            }
    
            const store: any = this.db[objectStore]
            const clearTable = await this.db.transaction('rw', store, async () => await store.clear().then(() => resolve(true)))
        })
    }
    
    public countStore(objectStore, whereCondition: IwhereCondition = { where: '', value: null }) : Observable<any> {
        return new Observable((observer) => {
            if (!objectStore || isEmpty(objectStore)) {
                observer.error('La tabla no fue seleccionada')
            }
    
            const store: any = this.db[objectStore]
    
            this.db.transaction('r', store, async () => {
                var items = await store
    
                if (whereCondition.where && whereCondition.value != null) {
                    observer.next(items.where(whereCondition.where).equals(whereCondition.value).count())
                }

                return items.count()
            }).then(count => {
                observer.next(count)
                observer.complete()
            }).catch(e => observer.error(e))
        })
    }
    
    public numberSync(objectStore, value: number = 0) {
        return this.countStore(objectStore, { where: 'Sync', value })
    }
    
    public async calculateSlopes(objectStore, key = 'Sync', value = 0) {
        if (!objectStore || isEmpty(objectStore)) {
            throw new Error('La tabla no fue seleccionada')
        }

        const store: any = this.db[objectStore]

        return await this.db.transaction('r', store, async () => {
            return store.where(key || '_id').equals(value).count()
        })
    }
    
    public deleteObject(objectStore, key, value) : Observable<any> {
        return new Observable((observer) => {
            if (!objectStore || isEmpty(objectStore)) {
                observer.error('La tabla no fue seleccionada')
            }
    
            const store: any = this.db[objectStore]
    
            this.db.transaction('r', store, async () => {
                return await store.where(key || '_id').equals(value).delete()
            }).then(values => {
                observer.next(values)
                observer.complete()
            }).catch(e => observer.error(e))
        })
    }
    
    public replaceStore(objectStore, data) {
        return this.cleanStore(objectStore).then(v => {
            if(!Array.isArray(data)) {
                data = [data]
            }
    
            return this.saveAll(objectStore, data, true)
        })
    }
}
