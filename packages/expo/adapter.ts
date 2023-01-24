import * as FileSystem from 'expo-file-system';
import {Adapter, RecordType} from '@nano-record/core/adapter';
import superjson from "superjson";
import Schema from "@nano-record/core/schema"


class ExpoAdapter implements Adapter {
    name: string;
    log : boolean;

    constructor(log: boolean = false) {

        this.log = log;
        this.name = `${FileSystem.documentDirectory}_${name}.json`;
    }

    async write<T>(schema : Schema<T>): Promise<void> {
        await FileSystem.writeAsStringAsync(this.name, superjson.stringify(schema));
    }

    async destroy() {
        await FileSystem.deleteAsync(this.name, {
            idempotent: true
        });
    }

    async read<T>(key: string, type : RecordType): Promise<Schema<T>> {
        const info = await FileSystem.getInfoAsync(this.name);

        if(this.log) console.log(info);
        
        if (!info.exists) {
            
            const defaultSchema :  Schema<T> = {
                key: key,
                data: [],
                schemaVersion: 1,
                type: type,
                createdAt : new Date()
            }

            await FileSystem.writeAsStringAsync(this.name, superjson.stringify(defaultSchema));
        }

        return superjson.parse<Schema<T>>(await FileSystem.readAsStringAsync(this.name));
    }
}

export default ExpoAdapter;