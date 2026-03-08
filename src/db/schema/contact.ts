import { uuid, varchar, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { hotel, hotel_chain } from "./hotel";

export const hotel_email = pgTable("hotel_email", {
    address_id: uuid().references(() => hotel.address_id),
    e_mail: varchar()
}, (table) => [
    primaryKey({columns: [table.address_id, table.e_mail]})
])

export const hotel_phone_number = pgTable("hotel_phone_number", {
    address_id: uuid().references(() => hotel.address_id),
    phone_number: varchar()
}, (table) => [
    primaryKey({columns: [table.address_id, table.phone_number]})
])

export const chain_email = pgTable("chain_email", {
    chain_name: uuid().references(() => hotel_chain.chain_name),
    e_mail: varchar()
}, (table) => [
    primaryKey({columns: [table.chain_name, table.e_mail]})
])

export const chain_phone_number = pgTable("chain_phone_number", {
    chain_name: uuid().references(() => hotel_chain.chain_name),
    phone_number: varchar()
}, (table) => [
    primaryKey({columns: [table.chain_name, table.phone_number]})
])