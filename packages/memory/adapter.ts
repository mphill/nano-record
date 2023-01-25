import {Adapter, RecordType} from "@nano-record/core/adapter"
import Schema from "@nano-record/core/schema"

/**
 * MemoryAdapter is a simple in-memory adapter for NanoRecord.
 */
class MemoryAdapter implements Adapter {
      
    private schema: Schema<any>;

    name: string = "memory";
    //read: () => Promise<T>;
    async write<T>(schema: Schema<T>) : Promise<void>   {
        this.schema = schema;
    } 

    async destroy() {
        return;
    }

    async read<T>(key: string, type : RecordType): Promise<Schema<T>> {
        return this.schema;
    }

    // Delete key from memory store
    async delete(key: string) : Promise<void>  {
        
    }
}

export default MemoryAdapter
