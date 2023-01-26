import { Adapter, RecordType } from "@nano-record/core/adapter"
import Schema from "@nano-record/core/schema";
import * as fs from "fs";
import * as nodepath from "path";
import superjson from 'superjson';

class NodeAdapter implements Adapter {
    path: string;
    storeName : string = "nano-record-store"

    constructor(path: string) {
        if (!path) {
            throw new Error("Path is required");
        }

        console.log("Nano Record Store: " + nodepath.resolve(path));

        const storeDirectory = nodepath.resolve(path, this.storeName);

        if(!fs.existsSync(storeDirectory)) {
            fs.mkdirSync(storeDirectory);
        }

        this.path = storeDirectory;
    }

    async read<T>(key: string, type: RecordType): Promise<Schema<T>> {
        if(!key) {
            throw new Error("Key is required");
        }

        const filename = this.computedFileName(key, type);

        const defaultSchema: Schema<T> = {
            data: type === RecordType.Collection ? [] : {} as T,
            schemaVersion: 1,
            type: type,
            createdAt : new Date(),
            key: key
        } satisfies Schema<T>;

        if (!fs.existsSync(filename)) {
            fs.writeFileSync(filename, superjson.stringify(defaultSchema));
        }

        let contents = fs.readFileSync(filename, { encoding: "utf-8" });

        // If the file is empty, return the default schema
        if (contents.trim() === "") {
            return {
                data: type === RecordType.Collection ? [] : {} as T,
                schemaVersion: 1,
                type: type,
                createdAt : new Date(),
                key: key
            } satisfies Schema<T>;
        }

        let schema = superjson.parse<Schema<T>>(contents);
        return schema;
    };

    async write<T>(schema: Schema<T>): Promise<void> {
        const filename = this.computedFileName(schema.key, schema.type);
        fs.writeFileSync(filename, superjson.stringify(schema));
    }

    async destroy(): Promise<void> {
        fs.unlinkSync(this.path);
    }
    async delete<T>(schema: Schema<T>) : Promise<void> {
        const filename = this.computedFileName(schema.key, schema.type);
        fs.unlinkSync(filename);
    }

    private computedFileName(key: string, type: RecordType): string {
        return `${this.path}/${key}.${type}.json`;
    }

    async items(): Promise<string[]> {
        const files = fs.readdirSync(this.path);
        
        var items = files.map((file) => {
            const parts = file.split(".");
            if(parts.length === 3 && parts[2] === "json") {
                return parts[0];
            }
        });

        return items;
    }

    async collections(): Promise<string[]> {
        const files = fs.readdirSync(this.path);
        
        var collections = files.map((file) => {
            const parts = file.split(".");
            if(parts.length === 3 && parts[2] === "json") {
                return parts[0];

            }
        });

        return collections;
    }
}

export default NodeAdapter;