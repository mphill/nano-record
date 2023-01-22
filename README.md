

<p align="center">
<img src="https://youcast.nyc3.digitaloceanspaces.com/logo.png" alt="Logo" width="30%" />
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

> ℹ️ For example `JSON.stringify()` stores Date objects as strings, and when `JSON.parse()` is called, the type of Date is lost - it will be a string. 



2. Thin lodash wrapper

3. Active record-like pattern inspired from Prism
4. Support for Expo, React Native, Node and Web

## Getting Started

**Initialize store:**

```ts
interface person {
  name: string,
  age: number,
  dob : Date
}

const adapter = new NodeAdapter<person>("persondb.json");
adapter.autoCommit = true; // Automatically safe after mutation
const store = await NanoRecord.init(adapter);
```



## CRUD Operations

 **Creating**

```ts
await store.create({
  name: "John",
  age: 21,
  dob : new Date()
}); // create a user

await store.createMany([{
  name: "John",
  age: 21,
  dob : new Date()
},
{ 
	name: "Jane", 
	age: 22, 
	dob : new Date() }
]); // create multiple users at once
```

**Reading**

```ts

store.findFirst(t => t.id = "33cfb41f-bbe1-4b52-a8ed-b5b0096e134f"); // Find first matching record

store.findMany(t => t.age >= 21); // Find all matching records

```

**Updating**

```ts
await store.updateFirst(t => t.age >= 21, person => { person.age = 22 }); // Update first matching records

await store.updateMany(t => t.age >= 21, person => { person.age = 22 }) // Update all matching records
```

**Deleting**

```ts
const success = await store.deleteFirst(t => t.age >= 21); // Return true if found and deleted

const recordsDeleted = await store.deleteMany(t => t.age >= 21); // Returns number of deleted records
```



## Other Operations

```ts
store.truncate(); // Clear all items in store

store.first(); // Get first item

store.last(); // Get last item

store.query(); // lodash hook

const result = store
  .query()
  .filter(t => t.age == 20)
  .sortBy(t => t.name, "asc")
  .first()
  .value(); // using lodash to get the first name alphabetically


await store.sync(); // flush all changes to storage adapter
```



## Data Access

```ts
let data :T[] = store.data; // contains the underlying data set. You can set this value too. 
```



## Auto Committing

Nano Record can be configured to automatically persist changes to the store upon mutation. If autoCommit is false, you must manually call sync() to write the changes to the store.



