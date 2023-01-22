interface Schema<T> {
    schemaVersion: number;
    data: T[];
}

export default Schema;