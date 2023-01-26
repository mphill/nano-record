
import {Adapter, RecordType} from './adapter';
import Item from './item';
import Collection from './collection';
import {verifyKey} from './utils';


class NanoRecord {
    private adapter: Adapter;
    
    constructor(adapter: Adapter) {
        this.adapter = adapter;
    }

    /**
     * Initialize a new collection
     * @param adapter 
     * @returns Promise<NanoRecord<T>>
     */
    public async collection<U>(key : string): Promise<Collection<U>> {
        if(!verifyKey(key)) {
            throw new Error("Key must be alphanumeric and contain no spaces or special characters");
        }

        key = key.toLowerCase();

        const instance = new Collection<U>(key, this.adapter);
        
        await instance.load(key, this.adapter);

        return instance;
    }

    /**
     * Initialize a new item
     * @param adapter
     * @returns Promise<NanoRecord<T>>
     */ 
    public async item<U>(key : string) : Promise<Item<U>> {
        if(!verifyKey(key)) {
            throw new Error("Key must be alphanumeric and contain no spaces or special characters");
        }

        key = key.toLowerCase();

        const instance =  new Item<U>();

        instance.load(key, this.adapter);

        return instance;
    }

    public async items() : Promise<string[]> {
        return await this.adapter.items();
    }

    public async collections() : Promise<string[]> {
        return await this.adapter.collections();
    }
}

export default NanoRecord;