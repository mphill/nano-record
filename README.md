

<p align="center">
<img src="https://youcast.nyc3.digitaloceanspaces.com/logo.png" alt="Logo" width="40%" />
</p>
<p align="center">
  A simple ORM written in TypeScript, backed by JSON files with some other spicy features. 🔥
</p>



## Key Features

1. Serialization powered by [superjson](https://github.com/blitz-js/superjson) 🚀 allowing type-safe storage of:


- `undefined` 
- `bigint`   
- `Date`    
- `RegExp`  
- `Set`      
- `Map`       
- `Error`    
- `URL`   

> **Note:**  `JSON.stringify()` stores Date objects as strings, and when `JSON.parse()` is called, the type of Date is lost - it will be a string. 

2. Thin [lodash](https://github.com/lodash/lodash) wrapper

3. Active record-like pattern
4. Support for Expo,  Node,  web, and memory
5. Super easy and fun to use



## Getting Started

Nano Records supports the following adapters:

### Expo

- JSON files saved to the mobile applications document directory

```bash
npm install --save https://github.com/mphill/nano-record/tree/main/packages/core
npm install --save https://github.com/mphill/nano-record/tree/main/packages/expo
```

### Node

```bash
npm install --save https://github.com/mphill/nano-record/tree/main/packages/core
npm install --save https://github.com/mphill/nano-record/tree/main/packages/node
```

### Web

- localStorage based

```bash
npm install --save https://github.com/mphill/nano-record/tree/main/packages/core
npm install --save https://github.com/mphill/nano-record/tree/main/packages/web
```

### Memory

- No presistence

```bash
npm install --save https://github.com/mphill/nano-record/tree/main/packages/core
npm install --save https://github.com/mphill/nano-record/tree/main/packages/memory
```



### Initialize Store

```ts
interface person {
  id: string,
  name: string,
  age: number
}

const adapter = new NodeAdapter("/path/to/store");
const nano = new NanoRecord(adapter);

const people = nano.collecion<person>("people");


```



## Adapters

Adapters are responsible for reading, writing and deleting data.  There are two main data storage mechanisms, `collections` and `items`.  You can think of a collection and as array of items.

```ts
nano.items(); // list all items in store ['item-key1', 'item-key2']
nano.collections(); // list all collections in store ['collection-key1', 'collection-key2']
```

Custom adapters can be created by implementing the `Adapter` interface in `@nano-record/core`.  



## Key Conventions for Collections and Items

Keys can only contain a-z, 0-9 or - and they must be lowercase.

```ts
const people = nano.collecion<person>("people"); 			// ✅
const people = nano.collecion<person>("people-item"); // ✅
const people = nano.collecion<person>("People"); 			// ❌
const people = nano.collecion<person>("people/item");	// ❌
const people = nano.collecion<person>("people.item");	// ❌
```



## Collections

### CRUD Operations

> 💣 **Note:** all mutations are async while all queries as sync

###  **Creating**

```ts
await people.create({
  id: store.makeId(),
  name: "John",
  age: 21
}); // create a user

await people.createMany([{
  id: store.makeId(),
  name: "John",
  age: 21
},
{ 
  id: store.makeId(),
  name: "Jane", 
  age: 22
}]); // create multiple users at once
```

### **Reading**

```ts

people.findFirst(t => t.id = "33cfb41f-bbe1-4b52-a8ed-b5b0096e134f"); // find first matching record

people.findMany(t => t.age >= 21); // find all matching records

```

### **Updating**

```ts
await people.updateFirst(t => t.age >= 21, person => { person.age = 22 }); // update first matching records

await people.updateMany(t => t.age >= 21, person => { person.age = 22 }) // update all matching records
```

### **Deleting**

```ts
const success = await people.deleteFirst(t => t.id == "33cfb41f-bbe1-4b52-a8ed-b5b0096e134f"); // return true if found and deleted

const recordsDeleted = await people.deleteMany(t => t.age >= 21); // returns number of deleted records
```



### Other Collection Operations

```ts

collection.makeId(); // generate a guid for id values, helpful for ids

collection.paginate(1, 20); // paginate collection results, start at page 1 and take 20

collection.first(); // get first item

collection.last(); // get last item

collection.query(); // lodash hook

const result = collection
  .query()
  .filter(t => t.age == 20)
  .sortBy(t => t.name, "asc")
  .first()
  .value(); // using lodash to get the first name alphabetically

collection.truncate(); // clear all items in the collection
```



## Item Storage

Nano Record supports storing items as key-values

```ts
// Store a counter
const count = await nano.item<number>("count"); 
await count.set(2)
console.log(count.get() == 2); // true

// Store user settings
const settings = await nano.item<{
	email: string,
	notifications: boolean
}>("settings"); 

await settings.set({
	email: "user@example.com",
	notifications: true
})
```



## Handing Schema Changes

Your JSON model may change over time, Nano Record can help.  Internally your model has a schemaVersion that will be 1 when you first create your store.

Let's say you want to convert date of birth stored as a unix timestamp to a Date object:

```ts
const adapter = new NodeAdapter<person>("persondb.json");
const store = await NanoRecord.init(adapter);

interface person {
  name: string,
  dob : int,
  dobDate: Date // <-- add a new field
}

if(store.schemaVersion == 1) {
  
	(await store.findMany()).forEach(p => {
    p.dobDate = new Date(p.dob);
  });
  
  store.schemaVersion++;
  store.sync();
}

// you can now remove the dob property in a future release - the old data will be automatically cleared, or add it back and map the data back to effectively rename the property
```









