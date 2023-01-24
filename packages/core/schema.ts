import { RecordType } from "./adapter";


interface Schema<T> {
    key: string;
    createdAt: Date;
    schemaVersion: number;
    data: T | T[];
    type: RecordType;
}

export default Schema;
