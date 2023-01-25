import MemoryAdapter from "../../memory/adapter";
import NodeAdapter from "../../node/adapter";
import NanoRecord from "../nanorecord";
import WebAdapter from "../../web/adapter";
import ExpoAdapter from "../../expo/adapter";

interface person {
    name: string,
    dob : Date,
    email: string,
    address: string,
    sex: "M" | "F",
}

const tests = async () => {
    const adapter = new NodeAdapter("/Users/mphill/code/nano-record/");

    const nano = new NanoRecord(adapter);
    
    const collection = await nano.collection<person>("person");
    
    // await collection.create({
    //     name: "matt", 
    //     email: "user@example.com",
    //     address: "1234 Main St",
    //     sex: "M",
    //     dob: new Date("2000-01-01")
    // });

    console.log(collection.count());

    const count = await nano.item<number>("ount-adsf"); 
    await count.set(2);

    const name = await nano.item<string>("counte-adsf"); 
    await name.set("matt");

    console.log(nano.items());



    

}

tests();