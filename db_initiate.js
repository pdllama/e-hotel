import "dotenv/config"
import fs from "fs"
import pkg from "pg"
import { allTypes, allTypeNames } from "./src/static/db_enum_types.ts";

console.log("Initializing the database schema...\n")

const { Client } = pkg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

await client.connect();

const sqlFiles = [
    "address", "person", "hotel", 
    "review", "archive",
    "contact", "photo"
]

let finalSql = ""
// Constructing the string to create the ENUM types for the SQL query.
// We have to do it this way rather than do it in an SQL file
// in order to allow it to be changed and stored in another file.
for (let i = 0;i<allTypes.length;i++) {
    const enum_type = allTypes[i]
    const enum_name = allTypeNames[i]
    let str_constr = `CREATE TYPE ${enum_name} AS ENUM (`
    for (let j=0;j < enum_type.length; j++) {
        const str = enum_type[j]
        str_constr += `'${str}'`
        if (j != enum_type.length-1) {
            str_constr += ', '
        }
    }
    str_constr += ');\n'
    // str_constr = 'CREATE TYPE <enum_name> AS ENUM ('str1', 'str2', 'str3', 'str4', ..... , 'strn');'
    finalSql += str_constr;
}


// console.log("ADDED ENUM TYPES")

for (let f of sqlFiles) {
    finalSql += fs.readFileSync(`src/db/schema/${f}.sql`, "utf8")
}

await client.query(finalSql);

console.log("Initialized the database!\n")
console.log("Please call npx tsx ./src/db/seeding/main.ts to seed the database.\n")

await client.end();

