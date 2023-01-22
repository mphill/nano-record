import Schema from "./schema";

interface Adapter<T> {
    name : string,
    read : () => Promise<Schema<T>>,
    write : (schema : Schema<T>) => Promise<void>,
    destroy : () => Promise<void>
}

export default Adapter;