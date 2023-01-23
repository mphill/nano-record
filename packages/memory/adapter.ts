import Adaptor from "@nano-record/core/adapter"
import Schema from "@nano-record/core/schema"

/**
 * MemoryAdapter is a simple in-memory adapter for NanoRecord.
 */
class MemoryAdapter<T> implements Adaptor<T> {    
    private schema: Schema<T>;

    name: string = "memory";
    //read: () => Promise<T>;
    async write(schema: Schema<T>) : Promise<void>   {
        this.schema = schema;
    } 

    async destroy() {
        return;
    }

    async read(): Promise<Schema<T>> {
        return this.schema;
    }

    autoCommit: boolean = true;
    schemaVersion: number = 1;

}

export default MemoryAdapter
