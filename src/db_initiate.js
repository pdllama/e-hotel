import "dotenv/config"
import fs from "fs"
import pkg from "pg"

const { Client } = pkg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

await client.connect();

const sqlFiles = [
    "address", "person"
]

let finalSql = ""

// TO-DO: DYNAMICALLY GENERATE CREATE ENUM TYPE STATEMENTS WITH STATIC.

for (let f of sqlFiles) {
    finalSql += fs.readFileSync(`src/db/schema/${f}.sql`, "utf8")
}

await client.query(finalSql);

await client.end();

console.log("FINALIZED DB INIT")