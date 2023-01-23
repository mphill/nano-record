import * as FileSystem from 'expo-file-system';
import Adapter from '@nano-record/core/adapter';
import superjson from "superjson";
import Schema from "@nano-record/core/schema"


class ExpoAdapter<T> implements Adapter<T> {
    name: string;
    log : boolean;

    constructor(name: string, log: boolean = false) {
        if(!name) {
            throw new Error("Name is required");
        }

        this.log = log;
        this.name = `${FileSystem.documentDirectory}_${name}.json`;
    }

    async write(schema : Schema<T>): Promise<void> {
        await FileSystem.writeAsStringAsync(this.name, superjson.stringify(schema));
    }

    async destroy() {
        await FileSystem.deleteAsync(this.name, {
            idempotent: true
        });
    }

    async read(): Promise<Schema<T>> {
        const info = await FileSystem.getInfoAsync(this.name);

        if(this.log) console.log(info);
        
        if (!info.exists) {
            
            const defaultSchema :  Schema<T> = {
                data: [],
                schemaVersion: 1
            }

            await FileSystem.writeAsStringAsync(this.name, superjson.stringify(defaultSchema));
        }

        return superjson.parse<Schema<T>>(await FileSystem.readAsStringAsync(this.name));
    }

    autoCommit: boolean = true;
    schemaVersion: number;

}

export default ExpoAdapter;