import { pgTable, uuid, integer, varchar, text } from "drizzle-orm/pg-core";
import { hotel, room_problem } from "./hotel";
import { review } from "./review";
import { person } from "./person";

export const photo = pgTable("photo", {
    url: varchar().primaryKey(),
    description: text()
})

export const hotel_photo = pgTable("hotel_photo", {
    url: varchar().primaryKey().references(() => photo.url),
    address_id: uuid().references(() => hotel.address_id)
})

export const review_photo = pgTable("review_table", {
    url: varchar().primaryKey().references(() => photo.url),
    review_id: uuid().references(() => review.review_id)
})

export const room_problem_photo = pgTable("room_problem_photo", {
    url: varchar().primaryKey().references(() => photo.url),
    problem_id: uuid().references(() => room_problem.problem_id)
})

export const profile_picture = pgTable("profile_picture", {
    url: varchar().primaryKey().references(() => photo.url),
    SSN: integer().references(() => person.SSN)
})

