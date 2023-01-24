import MemoryAdapter from "../../memory/adapter";
import NodeAdapter from "../../node/adapter";
import NanoRecord from "../nanorecord";
import WebAdapter from "../../web/adapter";
import ExpoAdapter from "../../expo/adapter";

interface person {
    name: string,
    age: number,
    dob : Date
}

const tests = async () => {
    const adapter = new ExpoAdapter();

    const nano = new NanoRecord(adapter);
    
    const collection = await nano.collection<person>("person"); // pass the adapter in to enabled auto commit
    

    await collection.create({name: "matt", age: 30, dob: new Date()});

    console.log(collection.count());

    const count = await nano.item<number>("count"); 

    await count.set(2)

    console.log(count.get() == 2); // true


    

}

tests();