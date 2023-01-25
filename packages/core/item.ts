import {Adapter, RecordType} from "./adapter";
import Schema from "./schema";
import { Loadable, verifyKey } from "./utils";

// A class that allows storage of a value with a set and get method
class Item<T> implements Loadable {
    private adapter: Adapter;
    public schema: Schema<T>;

    public get(): T {
        return this.schema.data as T;
    }

    public async set(value: T) {
        this.schema.data = value;
        await this.adapter.write(this.schema);
    }

    public async delete() {
        await this.adapter.delete<T>(this.schema);
        this.schema.data = undefined
    }

    async load(key : string, adapter: Adapter) {
        this.adapter = adapter;
        this.schema = await this.adapter.read<T>(key, RecordType.Item);
    }

}

export default Item;