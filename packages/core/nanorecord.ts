
import {Adapter, RecordType} from './adapter';
import Item from './item';
import Collection from './collection';
import Schema from './schema';


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
        const instance =  new Item<U>();

        instance.load(key, this.adapter);

        return instance;
    }
}

export default NanoRecord;