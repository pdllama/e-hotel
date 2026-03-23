import pkg from "pg";
import "dotenv/config"
const { Pool } = pkg;

//this is the main dbPool you use to connect to the db.

export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});