import * as FileSystem from 'expo-file-system';
import Adapter from '@nano-record/core/adapter';
import superjson from "superjson";

class ExpoAdapter<T> implements Adapter<T> {
    name: string;

    constructor(name: string) {
        this.name = `${FileSystem.documentDirectory}_${name}.json`;
    }

    async write(data: T[]): Promise<void> {
        await FileSystem.writeAsStringAsync(this.name, JSON.stringify(data));
    }

    async destroy() {
        await FileSystem.deleteAsync(this.name, {
            idempotent: true
        });
    }

    async read(): Promise<T[]> {
        const info = await FileSystem.getInfoAsync(this.name);

        if (!info.exists) {
            await FileSystem.writeAsStringAsync(this.name, superjson.stringify([]));
        }

        return superjson.parse(await FileSystem.readAsStringAsync(this.name));
    }

    autoCommit: boolean = true;
}