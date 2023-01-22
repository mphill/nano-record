import MemoryAdapter from "../../memory/adapter";
import NodeAdapter from "../../node/adapter";
import NanoRecord from "../nanorecord";
import WebAdapter from "../../web/adapter";

interface person {
    name: string,
    age: number,
    dob : Date
}

const tests = async () => {
    let adapter = new NodeAdapter<person>("test.json");
    const store = await NanoRecord.init(adapter);
    console.log(store.schemaVersion);
}

tests();