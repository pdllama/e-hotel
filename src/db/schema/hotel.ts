import {uuid, pgTable, pgEnum, timestamp, integer, varchar, boolean, text, primaryKey, foreignKey} from "drizzle-orm/pg-core"
import { address } from "./address"
import { employee } from "./person"
import { roomViewTypes, problemStatusStrArr, problemTypeStrArr } from "../../static/db_enum_types"

// TO-DO: NO ORMs. Raw SQL queries

export const viewsEnum = pgEnum("room_views", roomViewTypes)
export const problemStatusEnum = pgEnum("problem_status", problemStatusStrArr)
export const problemTypeEnum = pgEnum("problem_type", problemTypeStrArr)


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
    address_id: uuid(),
    room_number: integer(),
    type: problemTypeEnum(),
    description: text(),
    status: problemStatusEnum(),
    log_date: timestamp(),
    resolved_date: timestamp()
}, (table) => [
    foreignKey({
        columns: [table.address_id, table.room_number],
        foreignColumns: [room.address_id, room.room_number]
    })
])

export const room_amenity = pgTable("amenity", {
    amenity_name: varchar().primaryKey(),
    amenity_description: text()
})

export const room_has_amenity = pgTable("room_has_amenity", {
    address_id: uuid(),
    room_number: integer(),
    amenity_name: varchar().references(() => room_amenity.amenity_name)
}, (table) => [
    primaryKey({columns: [table.address_id, table.room_number, table.amenity_name]}),
    foreignKey({
        columns: [table.address_id, table.room_number],
        foreignColumns: [room.address_id, room.room_number]
    })
])