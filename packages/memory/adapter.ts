import Adaptor from "@nano-record/core/adapter"

/**
 * MemoryAdapter is a simple in-memory adapter for NanoRecord.
 */
class MemoryAdapter<T> implements Adaptor<T> {
    private collection: Array<T> = [];


    name: string = "memory";
    //read: () => Promise<T>;
    async write (data: T[]) {
        this.collection = data;
    } 

    async destroy() {
        return;
    }

    async read(): Promise<T[]> {
        return this.collection;
    }
    
    autoCommit: boolean = true;

}

export default MemoryAdapter
