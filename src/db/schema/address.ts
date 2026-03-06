import {integer, pgTable, varchar, uuid} from "drizzle-orm/pg-core"

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