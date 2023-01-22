import Adapter from "@nano-record/core/adapter";
import superjson from 'superjson';

class WebAdapter<T> implements Adapter<T> {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
    
    async read() : Promise<T[]> {
        return superjson.parse(window.localStorage.getItem(this.name) || "");
    };
    
    async write(data: T[]) : Promise<void> {
        window.localStorage.setItem(this.name, superjson.stringify(data));
    }
    
    async destroy() : Promise<void> {
        window.localStorage.removeItem(this.name);
    }
    
    autoCommit: boolean = true;
}

export default WebAdapter;