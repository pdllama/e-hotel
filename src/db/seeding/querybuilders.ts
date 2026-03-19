import type { Chain_Assignment, City_Stats } from "./seedingutils";
import { generateNewAddress, type Address } from "./seeding funcs/address-seeding";
import {v4 as uuidv4} from "uuid"
import type { PersonType } from "./seeding funcs/person-seeding";

// Functions to generate the query string to seed the DB

function seedAddress(addressData:Address, uuid:string) {
    // uuid optional
    const {street_name, street_number, apt_number, postal_code, city, state, country} = addressData
    if (uuid == undefined) {
        return `INSERT INTO address(street_name, street_number, apt_number, postal_code, city, state, country) VALUES (${street_name}, ${street_number}, ${apt_number}, ${postal_code}, ${city}, ${state}, ${country});\n`
    }
    return `INSERT INTO address(address_id, street_name, street_number, apt_number, postal_code, city, state, country) VALUES (${uuid}, ${street_name}, ${street_number}, ${apt_number}, ${postal_code}, ${city}, ${state}, ${country});\n`
}

function seedPerson(personData:PersonType) {
    let query = ''
    const addressData = personData.address
    const id = uuidv4();
    query += seedAddress(addressData, id);
    query += `INSERT INTO person(SSN, first_name, middle_name, last_name, address) VALUES (${personData.SSN, personData.first_name, personData.middle_name, personData.last_name, id})\n`
}

function seedEmployee(personData:PersonType, city:string, cityStat: City_Stats, is_manager:boolean) {

}

export function seedChains(chains:Chain_Assignment[], cityStats:{[key: string]: City_Stats}) {
    // Generates the sql query to insert chain values.

    let finalQuery = "";
    for (let ch of chains) {
        const cityStat = cityStats[ch.city as keyof City_Stats]
        const address:Address = generateNewAddress(ch.city, cityStat.state, cityStat.country, cityStat.lang, false);
        const id = uuidv4()
        finalQuery += seedAddress(address, id);
        finalQuery += `INSERT INTO hotel_chain(chain_name, co_address) VALUES (${ch.chain_name}, ${id})`;
    }
    
    return finalQuery;
}

export function seedHotels(cityStats:{[key: string]: City_Stats}) {
    // Generates the sql query to insert hotels

    let finalQuery = "";

}