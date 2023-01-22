import Adaptor from "@nano-record/core/adapter"
import fs from "fs";
import superjson from 'superjson';

class NodeAdapter<T> implements Adaptor<T> {
    name: string;

    constructor(name: string) {
        if(!fs.existsSync(name)) {
            fs.writeFileSync(name, superjson.stringify([]));
        }
        this.name = name;
    }
    
    async read() : Promise<T[]> {
        const contents = fs.readFileSync(this.name, { encoding: "utf-8" });
        let result = superjson.parse<T[]>(contents);

        return result;
    };
    
    async write(data: T[]) : Promise<void> {
        fs.writeFileSync(this.name, superjson.stringify(data));
    }
    
    async destroy() : Promise<void> {
        fs.unlinkSync(this.name);
    }
    
    autoCommit: boolean = true;
}

export default NodeAdapter;