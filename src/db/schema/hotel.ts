import {uuid, pgTable, pgEnum, timestamp, integer, varchar, boolean, text, primaryKey} from "drizzle-orm/pg-core"
import { address } from "./address"
import { employee } from "./person"
import { roomViewTypes, problemStatusStrArr, problemTypeStrArr } from "../../static/db_enum_types"

const viewsEnum = pgEnum("room_views", roomViewTypes)
const problemStatusEnum = pgEnum("problem_status", problemStatusStrArr)
const problemTypeEnum = pgEnum("problem_type", problemTypeStrArr)


export const hotel_chain = pgTable('hotel_chain', {
    chain_name: varchar().primaryKey(),
    co_address: uuid().references(() => address.address_id)
})

export const hotel = pgTable('hotel', {
    address_id: uuid().primaryKey().references(() => address.address_id),
    chain_name: varchar().references(() => hotel_chain.chain_name),
    manager_id: integer().references(() => employee.SSN)
})

export const room = pgTable('room', {
    address_id: uuid().references(() => hotel.address_id),
    room_number: integer(),
    price: integer(),
    capacity: integer(),
    view: viewsEnum(),
    extension_possible: boolean()
}, (table) => [
    primaryKey({columns: [table.address_id, table.room_number]})
])

export const room_problem = pgTable('room_problem', {
    problem_id: uuid().primaryKey(),
    address_id: uuid().references(() => room.address_id),
    room_number: integer().references(() => room.room_number),
    type: problemTypeEnum(),
    description: text(),
    status: problemStatusEnum(),
    log_date: timestamp(),
    resolved_date: timestamp()
})

export const room_amenity = pgTable("amenity", {
    amenity_name: varchar().primaryKey(),
    amenity_description: text()
})

export const room_has_amenity = pgTable("room_has_amenity", {
    address_id: uuid().references(() => room.address_id),
    room_number: integer().references(() => room.room_number),
    amenity_name: varchar().references(() => room_amenity.amenity_name)
}, (table) => [
    primaryKey({columns: [table.address_id, table.room_number, table.amenity_name]})
])