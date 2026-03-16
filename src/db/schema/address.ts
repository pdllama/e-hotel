import {integer, pgTable, varchar, uuid} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// export const address = sql`
//     CREATE TABLE IF NOT EXISTS address (
//         address_id UUID PRIMARY KEY
//         street_number integer 
//         apt_number varchar
//         postal_code varchar
//         city varchar
//         state varchar
//         country varchar
//     )
// `

export const address = pgTable("address", {
    address_id: uuid("address_id").primaryKey(),
    street_number: integer(),
    street_name: varchar(),
    apt_number: integer(),
    postal_code: varchar(),
    city: varchar(),
    state: varchar(),
    country: varchar()
})