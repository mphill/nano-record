import Schema from "./schema";
enum RecordType {
    Collection = 'collection',
    Item = 'item'
}

interface Adapter {
    read : <T>(key: string, type : RecordType) => Promise<Schema<T>>,
    write : <T>(schema : Schema<T>) => Promise<void>,
    delete : <T>(key: Schema<T>) => Promise<void>,
    destroy : () => Promise<void>,
    items : () => Promise<string[]>,
    collections: () => Promise<string[]>
}

export {
    Adapter,
    RecordType
};