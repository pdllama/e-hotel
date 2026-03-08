import {uuid, pgTable, integer, boolean, check, text, primaryKey} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { customer } from "./person"
import { hotel } from "./hotel"

export const review = pgTable('review', {
    review_id: uuid().primaryKey(),
    author_id: integer().notNull().references(() => customer.SSN),
    address_id: uuid().notNull().references(() => hotel.address_id),
    rating: integer("rating"),
    contents: text(),
}, (table) => [{
    ratingCheck: check(
        "rating_check",
        sql`${table.rating} BETWEEN 1 AND 5`
    )
}])

export const review_vote = pgTable('review_vote', {
    review_id: uuid().references(() => review.review_id),
    voter: integer().references(() => customer.SSN),
    like: boolean().notNull()
}, (table) => [
    primaryKey({columns: [table.review_id, table.voter]})
])