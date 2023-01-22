import Adaptor from "@nano-record/core/adapter"
import Schema from "@nano-record/core/schema";
import * as fs from "fs";
import superjson from 'superjson';

class NodeAdapter<T> implements Adaptor<T> {
    name: string;

    constructor(name: string) {
        if(!name) {
            throw new Error("Name is required");
        }

        this.name = name;
    }
    
    
    async read() : Promise<Schema<T>> {
        if(!fs.existsSync(this.name)) {
            const defaultSchema :  Schema<T> = {            
                data: [],
                schemaVersion: 1
            }

            fs.writeFileSync(this.name, superjson.stringify(defaultSchema satisfies Schema<T>));
        }

        let contents = fs.readFileSync(this.name, { encoding: "utf-8" });
      
        let result = superjson.parse<Schema<T>>(contents);

        return result;
    };
    
    async write(schema: Schema<T>) : Promise<void> {
        fs.writeFileSync(this.name, superjson.stringify(schema));
    }
    
    async destroy() : Promise<void> {
        fs.unlinkSync(this.name);
    }
}

export default NodeAdapter;