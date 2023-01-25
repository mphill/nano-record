import * as FileSystem from "expo-file-system";
import { Adapter, RecordType } from "@nano-record/core/adapter";
import superjson from "superjson";
import Schema from "@nano-record/core/schema";

class ExpoAdapter implements Adapter {
  log: boolean;

  constructor(log: boolean = false) {
    this.log = log;
  }

  async write<T>(schema: Schema<T>): Promise<void> {
    const filename = this.computedFileName(schema.key, schema.type);
    await FileSystem.writeAsStringAsync(filename, superjson.stringify(schema));
  }

  async delete<T>(schema: Schema<T>): Promise<void> {
    const filename = this.computedFileName(schema.key, schema.type);
    await FileSystem.deleteAsync(filename, {
      idempotent: true,
    });
  }

  async destroy() {
    // await FileSystem.deleteAsync(this.name, {
    //     idempotent: true
    // });
  }

  async read<T>(key: string, type: RecordType): Promise<Schema<T>> {
    const filename = this.computedFileName(key, type);
    const info = await FileSystem.getInfoAsync(filename);

    if (this.log) console.log(info);

    if (!info.exists) {
      const defaultSchema: Schema<T> = {
        key: key,
        data: [],
        schemaVersion: 1,
        type: type,
        createdAt: new Date(),
      };

      await FileSystem.writeAsStringAsync(
        filename,
        superjson.stringify(defaultSchema)
      );
    }

    return superjson.parse<Schema<T>>(
      await FileSystem.readAsStringAsync(filename)
    );
  }

  // Get all items
  public async items(): Promise<string[]> {
    const files = await FileSystem.readDirectoryAsync(
      `${FileSystem.documentDirectory}/nano`
    );
    var items = files.map((file) => {
      const parts = file.split(".");
      if (parts.length === 3 && parts[2] === "json") {
        return parts[0];
      }
    });

    return items;
  }

  // Get all collections
  public async collections(): Promise<string[]> {
    const files = await FileSystem.readDirectoryAsync(
      `${FileSystem.documentDirectory}/nano`
    );

    var collections = files.map((file) => {
      const parts = file.split(".");
      if (parts.length === 3 && parts[2] === "json") {
        return parts[0];
      }
    });

    return collections;
  }

  private computedFileName(key: string, type: RecordType): string {
    return `${FileSystem.documentDirectory}/nano/${name}.json`;
  }
}

export default ExpoAdapter;
