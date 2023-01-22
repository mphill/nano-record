
import _, { CollectionChain } from 'lodash';
import Adapter from './adapter';
import { randomUUID } from 'crypto'; 

class NanoRecord<T> {
    data: Array<T> = [];
    private adapter: Adapter<T>;

    /**
     * File on file system
     * @param name The name of the collection
     */
    private constructor(adapter: Adapter<T>, data: T[]) {
        this.data = data;
        this.adapter = adapter;
    }

    /**
     * Initialize a new collection
     * @param adapter 
     * @returns Promise<NanoRecord<T>>
     */
    public static async init<U>(adapter: Adapter<U>): Promise<NanoRecord<U>> {
        let data = await adapter.read();

        const instance = new NanoRecord<U>(adapter, data);

        instance.clean();

        return instance;
    }

    /**
     * Save the collection to the file system
     * @returns Promise<void>
     */
    private async commit() {
        if (this.adapter.autoCommit) {
            await this.sync();
        }
    }

    /**
     * Find all entries in the collection
     * @param filter 
     * @returns T[]
     */
    public findMany(filter?: (v: T) => boolean): T[] {
        if (filter == undefined) return this.query().value();

        return this.query().filter(filter).value() as T[];
    }

    /**
     * Find the first entry in the collection
     * @param filter 
     * @returns T
     */
    public findFirst(filter: (v: T) => boolean): T {
        return this.query().find(filter).value() as T;
    }

    /**
     * lodash chain
     * @returns CollectionChain<T>
     */
    public query(): CollectionChain<T> {
        return _.chain(this.data);
    }

    /**
     * Number of entries in the collection
     * @returns 
     */
    public count(): number {
        return this.data.length;
    }

    /**
     * Update many entries in the collection
     * @param filter 
     * @param match 
     */
    public async updateMany(filter: (v: T) => boolean, match: (r: T) => void): Promise<void> {
        this.findMany(filter).forEach(result => {
            match(result);
        });

        await this.commit();
    }

    /**
     * Update an entry in the collection
     * @param filter 
     * @param match 
     * @returns 
     */
    public async update(filter: (v: T) => boolean, match: (r: T) => void): Promise<boolean> {
        let result = this.findFirst(filter);

        if (result == undefined) return false;

        match(result);

        await this.commit();

        return true;
    }

    /**
     * Create a new entry in the collection
     * @param entry 
     */
    public async create(entry: T) {
        this.data.push(entry);

        await this.commit();
    }

    /**
     * Create many entries in the collection
     * @param entry 
     * @returns Promise<void>
     */
    public async createMany(entry: T[]): Promise<void> {
        this.data = this.data.concat(entry);

        await this.commit();
    }

    /**
     * Save the collection to the file system
     * @returns Promise<void>
     */
    public async sync(): Promise<void> {
        this.adapter.write(this.data);
    }

    /**
     * Remove an entry from the collection
     * @param filter 
     * @returns Promise<boolean>
     */
    public async delete(filter: (v: T) => boolean): Promise<boolean> {
        const result = _.without(this.data, _.find(this.data, filter));

        if (result == undefined) return false;

        this.data = result as T[];

        await this.commit();

        return true;
    }

    /**
     * Remove many entries from the collection
     * @param filter 
     * @returns Promise<number>
     */
    public async deleteMany(filter: (v: T) => boolean): Promise<number> {
        const initialSize = this.count();
        _.remove(this.data, filter);

        await this.commit();

        return initialSize - this.count();
    }

    /**
     * Remove all entries from the collection
     * @returns Promise<void>
     */
    public async truncate(): Promise<void> {
        this.data = [];
        this.commit();
    }

    /**
     * Return the first entry in the collection
     * @returns T
     */
    public first(): T {
        if (this.data.length == 0) throw new Error("Collection is empty");
        return this.data[0];
    }

    /**
     * Return the last entry in the collection
     * @returns T
     */
    public last(): T {
        if (this.data.length == 0) throw new Error("Collection is empty");
        return this.data[this.data.length - 1];
    }

    /**
     * Remove all null and undefined entries from the collection. TS isn't smart enough to know that this is possible in some cases, this method can clear this issues if it happens. Automatically called when the collection is initialized.
     * @returns Promise<void>
     */
    public async clean(): Promise<void> {
        this.data = _.remove(this.data, function (v) {
            return v != null && v != undefined;
        });

        await this.commit();
    }

    /**
     * Create a unique id
     * @param length C
     * @returns string
     */
    public makeId() : string {
        return randomUUID();
    }
}

export default NanoRecord;