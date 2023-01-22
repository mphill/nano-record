
// Auto id generation wrapper for objects concept;

// Each new record is added to an object with a random key, that key is now the primary key for the record
// This will allow constant access time for all operations these the primary key

interface DictionaryDatabase<T> {
    [key: string]: T;
}

interface PersonModel {
    name: string;
    age: Date
}

const database : DictionaryDatabase<PersonModel> = {};

const generateRandomId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
}

// Inserting and upating data become one and the same operation

database[generateRandomId()] = {
    name: "John",
    age: new Date()
}

database[generateRandomId()] = {
    name: "Jane",
    age: new Date()
}

database[generateRandomId()] = {
    name: "Frank",
    age: new Date()
}

console.info("Get all records");
console.log(database);

// {
//     lglloqwt8: { name: 'John', age: 2023-01-22T19:41:03.609Z },
//     uqi8b31v4: { name: 'Jane', age: 2023-01-22T19:41:03.609Z }
//  }


console.info("Iterate all records");

for(var i in database) {
    console.log(`Primary key: ${i}`);
    
    console.log(database[i]); // get item by key

    delete database[i]; // delete item by key

}


console.info("Verify all records are deleted: " + (Object.keys(database).length == 0));






