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
    const adapter = new MemoryAdapter<person>();
    adapter.autoCommit = true;
    


    const store = await NanoRecord.init(adapter);
    
    await store.createMany([
        { name: "John", age: 20, dob: new Date("1999-01-02") }, 
        { name: "Jane", age: 21, dob: new Date("2001-01-01") },
        { name: "Joy", age: 20, dob: new Date("2000-01-01") },
    ]);

    console.log(store.query().orderBy(t => t.dob, "desc").value());
}


tests();