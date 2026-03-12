// Database connection

import "dotenv/config"
import {drizzle} from 'drizzle-orm/node-postgres';

const db = drizzle({
    connection: {
        connectionString: process.env.DATABASE_URL!,
        ssl: true
    }
});

// async function test() {
//     await db.
// }

// test()

export default db