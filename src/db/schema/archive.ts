import {uuid, pgTable, pgEnum, date, integer, timestamp, boolean, foreignKey} from "drizzle-orm/pg-core"
import { archiveStatusStrArr } from "../../static/db_enum_types"
import { customer, employee } from "./person"
import { room } from "./hotel"

// const archiveStatus = ['booked', 'renting', 'completed', 'cancelled'] as const;

export const archive_status_pg_enum = pgEnum('archive_status', archiveStatusStrArr)

export const archive = pgTable('archive', {
    archive_id: uuid().primaryKey(),
    guest_id: integer().references(() => customer.SSN),
    address_id: uuid(),
    room_number: integer(),
    status: archive_status_pg_enum(),
    stay_start_date: date(),
    stay_end_date: date()
}, (table) => [
    foreignKey({
        columns: [table.address_id, table.room_number],
        foreignColumns: [room.address_id, room.room_number]
    })
])

export const booking = pgTable("booking", {
    archive_id: uuid().primaryKey().references(() => archive.archive_id),
    created_at: timestamp().defaultNow().notNull(),
    paid_for: boolean()
})

export const rental = pgTable("rental", {
    archive_id: uuid().primaryKey().references(() => archive.archive_id),
    check_in_time: timestamp(),
    check_out_time: timestamp(),
    checked_in_by: integer().references(() => employee.SSN),
    checked_out_by: integer().references(() => employee.SSN)
})