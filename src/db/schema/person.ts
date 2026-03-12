import {integer, pgTable, varchar, uuid, date, pgEnum, primaryKey} from "drizzle-orm/pg-core"
import { employeeRoles } from "../../static/db_enum_types"
import { address } from "./address"
import { hotel } from "./hotel"


export const employee_role_enum = pgEnum('employee_role', employeeRoles)

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

export const works_in = pgTable('works_in', {
    SSN: integer().references(() => employee.SSN),
    address_id: uuid().references(() => hotel.address_id),
    role: employee_role_enum()
}, (table) => [
    primaryKey({
        columns: [table.SSN, table.address_id]
    })
])

export const customer = pgTable('customer', {
    SSN: integer().references(() => person.SSN).primaryKey(),
    registration_date: date()
})