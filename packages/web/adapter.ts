import Adapter from "@nano-record/core/adapter";
import Schema from "@nano-record/core/schema";
import superjson from 'superjson';

class WebAdapter<T> implements Adapter<T> {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
    
    async read() : Promise<Schema<T>> {
        return superjson.parse<Schema<T>>(window.localStorage.getItem(this.name));
    };
    
    async write(schema: Schema<T>) : Promise<void> {
        window.localStorage.setItem(this.name, superjson.stringify(schema));
    }
    
    async destroy() : Promise<void> {
        window.localStorage.removeItem(this.name);
    }
}

export default WebAdapter;