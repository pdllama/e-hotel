import {integer, pgTable, varchar, uuid, date} from "drizzle-orm/pg-core"
import { address } from "./address"

export const person = pgTable('person', {
    SSN: integer().primaryKey(),
    first_name: varchar(),
    middle_name: varchar(),
    last_name: varchar(),
    address: uuid().references(() => address.address_id)
})

export const employee = pgTable('employee', {
    SSN: integer().references(() => person.SSN).primaryKey()
})

export const customer = pgTable('customer', {
    SSN: integer().references(() => person.SSN).primaryKey(),
    registration_date: date()
})