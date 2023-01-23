

<p align="center">
<img src="https://youcast.nyc3.digitaloceanspaces.com/logo.png" alt="Logo" width="40%" />
</p>
<p align="center">
  A simple ORM written in TypeScript, backed by JSON files with some other spicy features. 🔥
</p>




## Key Features

1. Serialization powered by [superjson](https://github.com/blitz-js/superjson) 🚀  allowing typesafe storage of:


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

Custom adapters can be created by implementing the Adapter interface in `@nano-record/core`

### Initialize store

```ts
interface person {
  id: string,
  name: string,
  age: number,
  dob : Date
}

const adapter = new NodeAdapter<person>("persondb.json");
const store = await NanoRecord.init(adapter);

store.autoCommit = true; // automatically save after mutation
```



## CRUD Operations

> **Note:** all mutations are async while all queries as sync

###  **Creating**

```ts
await store.create({
  id: store.makeId(),
  name: "John",
  age: 21,
  dob : new Date()
}); // create a user

await store.createMany([{
  id: store.makeId(),
  name: "John",
  age: 21,
  dob : new Date()
},
{ 
  id: store.makeId(),
  name: "Jane", 
  age: 22, 
  dob : new Date() 
}]); // create multiple users at once
```

### **Reading**

```ts

store.findFirst(t => t.id = "33cfb41f-bbe1-4b52-a8ed-b5b0096e134f"); // find first matching record

store.findMany(t => t.age >= 21); // find all matching records

```

### **Updating**

```ts
await store.updateFirst(t => t.age >= 21, person => { person.age = 22 }); // update first matching records

await store.updateMany(t => t.age >= 21, person => { person.age = 22 }) // update all matching records
```

### **Deleting**

```ts
const success = await store.deleteFirst(t => t.id == "33cfb41f-bbe1-4b52-a8ed-b5b0096e134f"); // return true if found and deleted

const recordsDeleted = await store.deleteMany(t => t.age >= 21); // returns number of deleted records
```



## Other Operations

```ts
store.makeid(); // generate a guid for id values

store.truncate(); // clear all items in store

store.first(); // get first item

store.last(); // get last item

store.query(); // lodash hook

const result = store
  .query()
  .filter(t => t.age == 20)
  .sortBy(t => t.name, "asc")
  .first()
  .value(); // using lodash to get the first name alphabetically


await store.sync(); // flush all changes to storage adapter
```



## Handing Schema Changes

Your JSON model may change over time, *Nano Record* can help.  Internally your model has a schemaVersion that will be 1 when you first create your store.

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



## Data Access

```ts
let data :T[] = store.data; // contains the underlying data set. You can set this value too. 
```



## Auto Committing

Nano Record can be configured to automatically persist changes to the store upon mutation. If autoCommit is false, you must manually call sync() to write the changes to the store.







