import type { Chain_Assignment, City_Stats } from "./seedingutils.ts";
import { generateNewAddress, type Address } from "./seeding funcs/address-seeding.ts";
import {v4 as uuidv4} from "uuid"
import { generateEmployee, type PersonType } from "./seeding funcs/person-seeding.ts";
import type { Works_In_Type } from "./seeding funcs/hotel-seeding-funcs.ts";
import type { RoomType } from "./seeding funcs/room-seeding.ts";

// Functions to generate the query string to seed the DB

function seedAddress(addressData:Address, uuid?:string) {
    // uuid optional
    const {street_name, street_number, apt_number, postal_code, city, state, country} = addressData
    if (uuid == undefined) {
        return `INSERT INTO address(street_name, street_number, apt_number, postal_code, city, state, country) VALUES ('${street_name}', ${street_number}, ${apt_number}, '${postal_code}', '${city}', '${state}', '${country}');\n`
    }
    return `INSERT INTO address(address_id, street_name, street_number, apt_number, postal_code, city, state, country) VALUES ('${uuid}', '${street_name}', ${street_number}, ${apt_number}, '${postal_code}', '${city}', '${state}', '${country}');\n`
}

function seedPerson(personData:PersonType) {
    let query = ""
    const addressData = personData.address
    const id = uuidv4();
    query += seedAddress(addressData, id);
    query += `INSERT INTO person(SSN, first_name, middle_name, last_name, address) VALUES (${personData.SSN}, '${personData.first_name}', '${personData.middle_name}', '${personData.last_name}', '${id}');\n`
    return query
}

function seedEmployee(
    personData:PersonType, 
    education_level:string, 
    works_in: Works_In_Type
)
{
    let resultQuery = ""
    resultQuery += seedPerson(personData)
    resultQuery += `INSERT INTO employee(SSN, education_level) VALUES (${personData.SSN}, '${education_level}');\n`
    resultQuery += `INSERT INTO works_in(SSN, address_id, role, pay_struct, pay) VALUES (${works_in.SSN}, '${works_in.address_id}', '${works_in.role}', '${works_in.pay_struct}', ${works_in.pay});\n`
    return resultQuery
}

export function seedCustomer(
    personData:PersonType,
    registration_date: string
) {
    let resultQuery = ""
    resultQuery += seedPerson(personData)
    resultQuery += `INSERT INTO customer(SSN, registration_date) VALUES (${personData.SSN}, '${registration_date}');\n`
    return resultQuery
}

function seedManager(personData:PersonType, education_level:string) {
    // Seeding manager has to be a bit different because we can't immediately put it in works_in, since the hotel has to be seeded with the manager.
    // So we just insert the employee without the works_in, which we do after.
    let resultQuery = ""
    resultQuery += seedPerson(personData)
    resultQuery += `INSERT INTO employee(SSN, education_level) VALUES (${personData.SSN}, '${education_level}');\n`
    return resultQuery
}

export function seedChains(chains:Chain_Assignment[], cityStats:{[key: string]: City_Stats}) {
    // Generates the sql query to insert chain values.
    let finalQuery = "";
    const chainSet = new Set<String>;
    
    for (let ch of chains) {
        if (chainSet.has(ch.chain_name)) {continue;}
        chainSet.add(ch.chain_name)
        const cityStat = cityStats[ch.city]
        const address:Address = generateNewAddress(ch.city, cityStat.state, cityStat.country, cityStat.lang, cityStat.country_code, false);
        const id = uuidv4()
        finalQuery += seedAddress(address, id);
        finalQuery += `INSERT INTO hotel_chain(chain_name, co_address) VALUES ('${ch.chain_name}', '${id}');\n`;
    }

    return finalQuery;
}

function seedHotel(chain_name:string, address_id:string, manager_id:number) {
    return `INSERT INTO hotel(address_id, chain_name, manager_id) VALUES ('${address_id}', '${chain_name}', ${manager_id});\n`
}

export function seedHotels(cityStats:{[key: string]: City_Stats}) {
    // Generates the sql query to insert hotels and their managers

    let finalQuery = "";

    const allCities = Object.keys(cityStats);
    for (let city of allCities) {
        const cityStat = cityStats[city]
        for (let i=0; i<cityStat.hotel_chains.length; i++) {
            const chain = cityStat.hotel_chains[i]
            const size = cityStat.hotel_sizes[i]
            const address_id = cityStat.hotel_address_uuid[i]

            const hotel_address_data: Address = generateNewAddress(city, cityStat.state, cityStat.country, cityStat.lang, cityStat.country_code, false);
            finalQuery += seedAddress(hotel_address_data, address_id)

            const {person, education_level, salary} = generateEmployee(city, cityStat, true) // this will be the manager

            finalQuery += seedManager(person, education_level);
            finalQuery += seedHotel(chain, address_id, person.SSN);
            finalQuery += `INSERT INTO works_in(SSN, address_id, role, pay, pay_struct) VALUES (${person.SSN}, '${address_id}', 'General Manager', ${salary}, 'salary');\n`; 
        }
    }
    return finalQuery
}

export function seedHotelEmployees(
    fullEmployeeData: {
        person: PersonType,
        education_level: string,
        works_in: Works_In_Type
    }
) {
    return seedEmployee(fullEmployeeData.person, fullEmployeeData.education_level, fullEmployeeData.works_in)
}

export function seedHotelRoom(
    room: RoomType,
    hotel_amns: string[],
    room_amns:string[],
) {
    let insertQuery = ""
    if (!room.view ) { // if its undefined or null or a "falsy" value (0, "")
        insertQuery += `INSERT INTO room(address_id, room_number, price, capacity, extension_possible) VALUES ('${room.address_id}', ${room.room_number}, ${room.price}, ${room.capacity}, ${room.extension_possible});\n`
    } else {
        insertQuery += `INSERT INTO room(address_id, room_number, price, capacity, view, extension_possible) VALUES ('${room.address_id}', ${room.room_number}, ${room.price}, ${room.capacity}, '${room.view}', ${room.extension_possible});\n`
    } 

    for (let hotel_amn of hotel_amns) {
        // Note that the distinction of hotel_amn vs room_amn is purely seeding wise.
        // hotel_amn means that the amenity applies to every room in the hotel, while room_amn means it applies only to that room in the hotel.
        // There's a strong design argument to be made to differentiate hotel amenities from room amenities into different tables,
        // But that would require more work that goes beyond this course, and I've already spent an inappropriate amount of time on this seeding function
        insertQuery += `INSERT INTO room_has_amenity(address_id, room_number, amenity_name) VALUES ('${room.address_id}', ${room.room_number}, '${hotel_amn}');\n`
    }
    for (let room_amn of room_amns) {
        // There's no overlap between room amenities and hotel amenities so this should be safe.
        insertQuery += `INSERT INTO room_has_amenity(address_id, room_number, amenity_name) VALUES ('${room.address_id}', ${room.room_number}, '${room_amn}');\n`
    }

    if (room.problem) {
        const {problem_id, hotel_address, room_number, type, description, status, log_date, resolved_date} = room.problem
        if (!resolved_date) {
            insertQuery += `INSERT INTO room_problem(problem_id, address_id, room_number, type, description, status, log_date) VALUES
                            ('${problem_id}', '${hotel_address}', ${room_number}, '${type}', '${description}', '${status}', '${log_date}');\n`
        } else {
            insertQuery += `INSERT INTO room_problem(problem_id, address_id, room_number, type, description, status, log_date, resolved_date) VALUES
                            ('${problem_id}', '${hotel_address}', ${room_number}, '${type}', '${description}', '${status}', '${log_date}', '${resolved_date}');\n`
        }
    }
    return insertQuery
}

export function seedArchive(aData:any) {
    let query = ""
    const {archive} = aData

    // archive_id      UUID    PRIMARY KEY,
    // guest_id        INTEGER,
    // address_id      UUID,
    // room_number     INTEGER,
    // status          archive_status,
    // stay_start_date DATE,
    // stay_end_date   DATE,
    query += `INSERT INTO archive(archive_id, guest_id, address_id, room_number, status, stay_start_date, stay_end_date) VALUES
                ('${archive.archive_id}', ${archive.guest_id}, '${archive.address_id}', ${archive.room_number}, '${archive.status}', '${archive.stay_start_date}', '${archive.stay_end_date}');\n`
    
    if (aData.booking != undefined) {
        const {booking} = aData
        query += `INSERT INTO booking(archive_id, created_at, paid_for) VALUES ('${booking.archive_id}', '${booking.created_at}', ${booking.paid_for});`
    } 
    if (aData.rental != undefined) {
        const {rental} = aData
        query += `INSERT INTO rental(archive_id, check_in_time${seedFieldConditionally(rental, "check_out_time", true)}${seedFieldConditionally(rental, "checked_in_by", true)}${seedFieldConditionally(rental, "checked_out_by", true)}) 
                VALUES 
                ('${rental.archive_id}', '${rental.check_in_time}'${seedFieldConditionally(rental, "check_out_time", false, true)}${seedFieldConditionally(rental, "checked_in_by", false)}${seedFieldConditionally(rental, "checked_out_by", false)});\n`
    }
    return query
}

export function seedReview(review:any) {
    let query = ""
    if (review.contents != undefined) {
        query += `INSERT INTO review(review_id, author_id, address_id, rating, contents) VALUES ('${review.review_id}', ${review.author_id}, '${review.address_id}', ${review.rating}, '${review.contents}');\n`
    } else {
        query += `INSERT INTO review(review_id, author_id, address_id, rating) VALUES ('${review.review_id}', ${review.author_id}, '${review.address_id}', ${review.rating});\n`
    }
    return query
}

function seedFieldConditionally(values:any, field:string, returnFieldName: boolean, nonnumeric:boolean = false) {
    return values[field] != undefined ? `, ${returnFieldName ? field : nonnumeric ? `'${values[field]}'` : values[field]}` : ""
}