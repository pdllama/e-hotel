import {uuid, pgTable, pgEnum, date, integer} from "drizzle-orm/pg-core"
import { archiveStatusStrArr } from "../../static/archive_status_types"

// const archiveStatus = ['booked', 'renting', 'completed', 'cancelled'] as const;

const archiveStatusPgEnum = pgEnum('archiveStatus', archiveStatusStrArr)

export const archive = pgTable('archive', {
    archive_id: uuid().primaryKey(),
    guest_id: integer(),
})