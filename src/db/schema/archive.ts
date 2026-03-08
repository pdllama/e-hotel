import {uuid, pgTable, pgEnum, date, integer, timestamp, boolean} from "drizzle-orm/pg-core"
import { archiveStatusStrArr } from "../../static/db_enum_types"
import { customer, employee } from "./person"
import { room } from "./hotel"

// const archiveStatus = ['booked', 'renting', 'completed', 'cancelled'] as const;

const archiveStatusPgEnum = pgEnum('archiveStatus', archiveStatusStrArr)

export const archive = pgTable('archive', {
    archive_id: uuid().primaryKey(),
    guest_id: integer().references(() => customer.SSN),
    address_id: uuid().references(() => room.address_id),
    room_number: integer().references(() => room.room_number),
    status: archiveStatusPgEnum(),
    stay_start_date: date(),
    stay_end_date: date()
})

export const booking = pgTable("booking", {
    archive_id: uuid().primaryKey().references(() => archive.archive_id),
    created_at: timestamp(),
    paid_for: boolean()
})

export const rental = pgTable("rental", {
    archive_id: uuid().primaryKey().references(() => archive.archive_id),
    check_in_time: timestamp(),
    check_out_time: timestamp(),
    checked_in_by: integer().references(() => employee.SSN),
    checked_out_by: integer().references(() => employee.SSN)
})