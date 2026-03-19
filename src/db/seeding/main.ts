import "dotenv/config"
import pkg from "pg"
import {default as countries} from './seeding data/address-seeding-data.json' with {type:'json'} 
import { seed_city } from './seeding funcs/hotel-seeding-funcs.ts';
import type { Hotel_Assignment, Chain_Assignment, City_Stats } from './seedingutils.ts';
import { seedChains } from "./querybuilders.ts";

const { Client } = pkg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

await client.connect();

// We setup assignments for the num of hotels (3-5 per city)


const chains : Chain_Assignment[] = [];
//const hotels : {[key: string]: Hotel_Assignment} = {};
const cityStats : {[key: string]: City_Stats} = {}



type CountriesType = typeof countries

const country_codes : string[] = Object.keys(countries);

// Populates cityStats data which will be important for seeding
for (let country of country_codes as (keyof CountriesType)[]) {
    const data = countries[country];
    for (let i=0; i < data.cities.length; i++) {
        const city = data.cities[i];
        const cityToStateCountryObj : City_Stats = {country: data.name, state: data.states[i], lang: data.language, num_hotels: 0, hotel_chains: [], hotel_sizes: [], hotel_address_uuid: []};
        cityStats[city] = cityToStateCountryObj;
    }
}

//assigns chain names, hotels, and hotel sizes to each of the cities
for (let country of country_codes as (keyof CountriesType)[]) {
    const data = countries[country];
    for (let i=0; i < data.cities.length; i++) {
        const city = data.cities[i];
        //Seed city
        seed_city(chains, cityStats, city, data.cities.filter(c => c != city && cityStats[c].num_hotels > 0))
    }
}

//Inserts hotel chains
const chainQuery = seedChains(chains, cityStats);
await client.query(chainQuery);

// Generates hotels per city
for (let city of Object.keys(cityStats)) {
    const cityStat = cityStats[city];

}
