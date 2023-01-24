import Schema from "./schema";
enum RecordType {
    Collection = 'collection',
    Item = 'item'
}

interface Adapter {
    read : <T>(key: string, type : RecordType) => Promise<Schema<T>>,
    write : <T>(schema : Schema<T>) => Promise<void>,
    destroy : () => Promise<void>
}

export {
    Adapter,
    RecordType
};