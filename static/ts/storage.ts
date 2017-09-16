export var _db: any;
export var _hasIndexedDB: boolean = false;
export var _localDBName: string;
export var _localDBVersion: number;
export var _localDBStore: string;
export function createObjectStore(localDBName: string, localDBVersion: number, localDBStore: string): any {
    _localDBName = localDBName;
    _localDBVersion = localDBVersion;
    _localDBStore = localDBStore;
    var p = new Promise((resolve, reject) => {
        try {
            (<any>window).indexedDB = (<any>window).indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;
            (<any>window).IDBTransaction = (<any>window).IDBTransaction || (<any>window).webkitIDBTransaction || (<any>window).msIDBTransaction || { READ_WRITE: "readwrite" }; 
            (<any>window).IDBKeyRange = (<any>window).IDBKeyRange || (<any>window).webkitIDBKeyRange || (<any>window).msIDBKeyRange;
            if (!window.indexedDB) {
                console.log("Warning: IndexedDB is unavailable. Using sessionStorage instead.");
            }
            else {
                _hasIndexedDB = true;
                let request = window.indexedDB.open(_localDBName, _localDBVersion);
                request.onerror = function(evt) {
                    _hasIndexedDB = false;
                    console.log("Warning: Access to IndexedDB for application has been rejected.");
                };
                request.onupgradeneeded = function (evt) {
                    let objectStore = (<any>evt.currentTarget).result.createObjectStore(_localDBStore, { keyPath: "name" });
                    objectStore.createIndex("name", "name", { unique: true });
                    objectStore.transaction.oncomplete = function(oevt) {
                        console.log(`Info: Object store has been successfully created. ${objectStore}`);
                    };
                };
                request.onsuccess = function(evt) {
                    _db = (<any>evt.target).result;
                    console.log(`Info: Database initialized. ${_db}`);
                    resolve(_db);
                };
            }
        }
        catch(e) {
            console.log(`Error: Failed to initialize storage. ${e}`);
            reject(e);
        }
    });
    return p;
}
export function getObjectStore(): any {
    try {
        let transaction = _db.transaction(_localDBStore, "readwrite");
        return transaction.objectStore(_localDBStore);
    }
    catch(e) {
        console.log(`Error: Failed to get object store. ${e}`);
        return null;
    }
}
export function getItem(s: string, val?: string): any {
    var p = new Promise((resolve, reject) => {
        try {
            if(window.indexedDB != null) {
                let objectStore = getObjectStore();
                var request = objectStore.get(s);
                request.onsuccess = function(evt) {
                    if(val != null && evt.target.result != null) {
                        resolve(evt.target.result[val]);
                    }
                    else {
                        resolve(evt.target.result);
                    }
                };
            }
            else if(sessionStorage != null) {
                resolve(sessionStorage.getItem(s));
            }
        }
        catch(e) {
            console.log(`Error: Failed to retrieve item. ${e}`);
            reject(e);      
        }
    });
    return p;
}
export function setItem(s: string, a: any): any {
    var p = new Promise((resolve, reject) => {
        try {
            if(window.indexedDB != null) {
                let objectStore = getObjectStore();
                let item = { "name": s, "value": a };
                var request = objectStore.put(item);
                    request.onsuccess = function(evt) {
                        console.log(`Info: Item added to the object store. ${evt.target.result}`);
                        resolve(evt.target.result);
                };
            }
            else if(sessionStorage != null) {
                sessionStorage.setItem(s, a);
                resolve(true);
            }
        }
        catch(e) {
            console.log(`Error: Failed to set item. ${e}`);
            reject(e);
        }
    });
    return p;
}
export function removeItem(s: string): any {
    var p = new Promise((resolve, reject) => {
        try {
            if(window.indexedDB != null) {
                var request = getObjectStore().delete(s);
                request.onsuccess = function(evt) {
                    console.log("Info: Object deleted.");
                    resolve(true);
                };
            }
            else if(sessionStorage != null) {
                sessionStorage.removeItem(s);
                resolve(true);
            }
        }
        catch(e) {
            console.log(`Error: Failed to remove item. ${e}`);
            reject(e);
        }
    });
    return p;
}
export function clearItems(): boolean {
    try {
        if(window.indexedDB != null) {
            getObjectStore().clear();
        }
        if(sessionStorage != null) {
            sessionStorage.clear();
            return true;
        }
    }
    catch(e) {
        console.log(`Error: Failed to clear items. ${e}`);
        return false;
    }
    return false;
}
