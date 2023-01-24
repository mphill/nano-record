import { Adapter, RecordType } from "@nano-record/core/adapter"
import Schema from "@nano-record/core/schema";
import superjson from 'superjson';

class WebAdapter implements Adapter {
    async read<T>(key: string, type: RecordType): Promise<Schema<T>> {
        return superjson.parse<Schema<T>>(window.localStorage.getItem(this.getKey(key, type)));
    };

    async write<T>(schema: Schema<T>): Promise<void> {
        window.localStorage.setItem(this.getKey(schema.key, schema.type), superjson.stringify(schema));
    }

    async destroy(): Promise<void> {
        // get all local storage keys
        const keys = Object.keys(window.localStorage);
        // loop over all keys
        for (let i = 0; i < keys.length; i++) {
            // check if the key is a nano key
            if (keys[i].startsWith("nano_")) {
                // remove the key
                window.localStorage.removeItem(keys[i]);
            }
        }
    }

    private getKey(key: string, type: RecordType) {
        return `nano_${key}_${type}`;
    }
}


export default WebAdapter;