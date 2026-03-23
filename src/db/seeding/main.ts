import "dotenv/config"
import pkg from "pg"
import {default as countries} from './seeding data/address-seeding-data.json' with {type:'json'} 
import {default as amenities} from './seeding data/hotel/room-amenities.json' with {type:'json'}
import { generateEmployees, seed_city } from './seeding funcs/hotel-seeding-funcs.ts';
import { type Hotel_Assignment, type Chain_Assignment, type City_Stats, type Hotel_Stats, type Hotel_RoomNum_Map, convertToHotelSizeMapping, type ProblemMapping, parse_date, addProblemMap, get_rand_arr_item, roll_chance_multi, get_rand_between } from './seedingutils.ts';
import { seedArchive, seedChains, seedCustomer, seedHotelEmployees, seedHotelRoom, seedHotels, seedReview } from "./querybuilders.ts";
import { decideBaseRoomPrice, decideHotelAmenities, generateRoom, roll_room_assignments } from "./seeding funcs/room-seeding.ts";
import {add, eachDayOfInterval} from "date-fns"
import { generateCustomer } from "./seeding funcs/person-seeding.ts";
import { generateArchive } from "./seeding funcs/archive-seeding.ts";
import { generateReview } from "./seeding funcs/review-seeding.ts";

const { Client } = pkg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
})

await client.connect();

console.log("Deleting previous on the tables, if there were any...\n")

const tables = ["review", "rental", "booking", "archive", "customer", "room_problem", "room_has_amenity", "amenity", "room", "works_in", "hotel", "employee", "hotel_chain", "person", "address"];
for (let t of tables) {await client.query(`DELETE FROM ${t}`)} // just deletes other data


// We setup assignments for the num of hotels (3-5 per city)


const chains : Chain_Assignment[] = [];
//const hotels : {[key: string]: Hotel_Assignment} = {};
const cityStats : {[key: string]: City_Stats} = {}
const problemMap:ProblemMapping = {}

const numCustomers = 5000 //Can customize the number of customers

const customerSSN:number[] = new Array(5000) // list of all customer SSNs. 
const customerRegDate:string[] = new Array(5000) // list of customer RegDate. used for archive seeding.


type CountriesType = typeof countries

const country_codes : string[] = Object.keys(countries);

console.log("Generating city data....\n")

// Populates cityStats data which will be important for seeding
for (let country of country_codes as (keyof CountriesType)[]) {
    const data = countries[country];
    for (let i=0; i < data.cities.length; i++) {
        const city = data.cities[i];
        const cityToStateCountryObj : City_Stats = {country: data.name, country_code: country, state: data.states[i], lang: data.language, num_hotels: 0, hotel_chains: [], hotel_sizes: [], hotel_address_uuid: []};
        cityStats[city] = cityToStateCountryObj;
    }
}

console.log("Generated city data!\n")

console.log("Generating hotel data...")

const allCities = Object.keys(cityStats);

//assigns chain names, hotels, and hotel sizes to each of the cities
for (let country of country_codes as (keyof CountriesType)[]) {
    const data = countries[country];
    for (let i=0; i < data.cities.length; i++) {
        const city = data.cities[i];
        //Seed city
        seed_city(chains, cityStats, city, data.cities.filter(c => c != city && cityStats[c].num_hotels > 0))
    }
}

console.log("Generated hotel data!\n")
console.log("Seeding hotel chains...")

//Inserts hotel chains
const chainQuery = seedChains(chains, cityStats);
await client.query(chainQuery);
// await seedChains(chains, cityStats,client);


console.log("Seeded hotel chains!\n")

// This is a surprise tool that will help us later :P
const hotelSizeMapping:Hotel_RoomNum_Map = convertToHotelSizeMapping(cityStats) // This function also rolls the number of rooms

console.log("Seeding hotels...")

// Inserts hotels w/ managers
const hotelQuery = seedHotels(cityStats);
await client.query(hotelQuery)
// await seedHotels(cityStats, client);

console.log("Seeded hotels!\n")

// maps hotel address id -> array of its receptionists. used for archives.
const hotel_receptionist_map:{[key:string]: number[]}  = {}

console.log("Seeding hotel employees...")

// Generates employees for the hotels
const hotel_address_ids = Object.keys(hotelSizeMapping) 
for (let hid of hotel_address_ids) {
    hotel_receptionist_map[hid] = []
    const sizeData = hotelSizeMapping[hid]
    const employees = generateEmployees(sizeData.numRooms, hid, sizeData.city, cityStats[sizeData.city]);
    let insertQuery = ""
    for (let e of employees) {
        if (e.works_in.role == "Receptionist") {hotel_receptionist_map[hid].push(e.person.SSN)}
        insertQuery += seedHotelEmployees(e)
    }
    await client.query(insertQuery)
}

console.log("Seeded hotel employees!\n")
console.log("Seeding Room Amenities...")

// Seeds all the room amenities. important for the next step.
let amenityQuery = ""
for (let amenity of amenities) {
    amenityQuery += `INSERT INTO amenity(amenity_name, amenity_description) VALUES ('${amenity.amenity_name}', '${amenity.amenity_description}');\n`
}
await client.query(amenityQuery)

console.log("Seeded Room Amenities!\n")

console.log("Seeding Hotel Rooms...")

// Generates the rooms for the hotels based on hotelSizeMapping
for (let hid of hotel_address_ids) {
    problemMap[hid] = {}
    const sizeData = hotelSizeMapping[hid]
    const {rpf, reserved} = roll_room_assignments(sizeData.size)

    const room_base_prices = decideBaseRoomPrice(sizeData.size)
    const base_amenities = decideHotelAmenities(sizeData.size)

    let currentRoom = 202+reserved //202 is the baseline first usable room for any hotel, then the number of extra reserved rooms per hotel add onto that.
    let firstUsableRoom = currentRoom
    let roomLimit = currentRoom+rpf //roomLimit is the room number that is the last room number of the floor +1, because we count 202. ex 202 with rpf = 20, this value would be 222 when the last room number would be 221
    let numRoomsToBeAdded = sizeData.numRooms;
    

    let insertQuery = ""
    while(numRoomsToBeAdded > 0) {
        const {room, room_amns} = generateRoom(hid, currentRoom, sizeData.size, room_base_prices);
        problemMap[hid][currentRoom] = {}
        insertQuery += seedHotelRoom(room, base_amenities, room_amns)
        if (room.problem) {
            // if theres a room problem we need to add it to our stays object to ensure that, when we
            // populate archive/booking/rental data, no one can book a stay at that time.

            // log_date is a timestamp so we need to parse out the time part (YYYY-MM-DD HH:MM:SS) based on the space.
            const log_date_date = room.problem.log_date.slice(0, room.problem.log_date.indexOf(" "))
            const {year, month, day} = parse_date(log_date_date); 
            let endDay;
            let endMonth;
            let endYear;
            // Setting the arbitrary rule that if a problem hasn't been resolved, people can only book after 1 week. 
            // Meaning functionally, hotels must get their room problem solved within 7 days

            if (!room.problem.resolved_date) {
                const endDate = add(new Date(year, month, day), {days: 7})
                endDay = endDate.getDate()
                endMonth = endDate.getMonth()+1
                endYear = endDate.getFullYear()
            } else {
                const endData = parse_date(room.problem.resolved_date)
                endDay = endData.day
                endMonth = endData.month
                endYear = endData.year
            }

            const dateInterval = {start: new Date(year, month, day), end: new Date(endYear, endMonth, endDay)}

            for (let date of eachDayOfInterval(dateInterval)) {
                const currDay = date.getDate()
                const currMonth = date.getMonth()+1
                const currYear = date.getFullYear()

                addProblemMap(hid, currentRoom, currYear, currMonth, currDay, problemMap)
            }
        }

        currentRoom++
        numRoomsToBeAdded--

        if (roomLimit == currentRoom) { // If we hit the number of floors for this room
            firstUsableRoom += 100
            roomLimit += 100
            currentRoom = firstUsableRoom
        }

    }

    await client.query(insertQuery);
}

console.log("Seeded Hotel Rooms!\n")

// Object mapping hotel_address_id => [room_number1, room_number2, .... room_numberN]
// Important for archive seeding
const validHotelRooms:{[key:string]: string[]} = {}
for (let hid of hotel_address_ids) {
    const roomNums = Object.keys(problemMap[hid])
    validHotelRooms[hid] = roomNums
}

console.log("Seeding Customers...")

// Seeding customers and storing customer SSNs for later for archives.
for (let i = 0; i < numCustomers;i++) {
    let customerQuery = ""
    const residence_city = get_rand_arr_item(allCities);
    const {person, registration_date} = generateCustomer(residence_city, cityStats[residence_city])
    customerQuery += seedCustomer(person, registration_date);
    customerSSN[i] = person.SSN
    customerRegDate[i] = registration_date
    await client.query(customerQuery)
}


console.log("Seeded Customers!\n")

const currDate = new Date()

// Seeding archives. constraints:
//  1. up to one archive per room
//  2. 10-15 archives per small hotel, 20-25 per med hotel, 30-35 per lg hotel. upper bound: 35*575 = 20,125 archives
//  3. if the # of rolled archives exceeds the num of rooms in the hotels (small hotels), then its just one archive per room.
//  4. we designate 40% of archives as future bookings, 20% as current rentals, the rest the func decides. 
//  5. current rentals can NOT be assigned to rooms with ongoing problems. 
//          realistically this wont happen, but if all rooms have ongoing problems, then no archives get assigned as current rentals. 

console.log("Seeding Archives...")

for (let hid of hotel_address_ids) {
    let archive_insert_query = ""
    let rooms = validHotelRooms[hid]
    const sizeData = hotelSizeMapping[hid]

    const numArchivesMin = sizeData.size == "sm" ? 10 : sizeData.size == "md" ? 20 : 30;
    const numArchivesMax = sizeData.size == "sm" ? 15 : sizeData.size == "md" ? 25 : 35;
    const numArchives = get_rand_between(numArchivesMin, numArchivesMax);

    let numBookings = Math.floor((numArchives/100)*40);
    let numRentals = Math.floor((numArchives/100)*20);
    let numOther = Math.floor((numArchives/100)*40);

    for (let i = 0; i < numArchives; i++) {
        // Num archives won't actually be numArchives. can be 1-2 less because of the floor function
        if (numOther == 0 && numBookings == 0 && numRentals == 0) {break;}

        const room_num = get_rand_arr_item(rooms)
        if (room_num == undefined) {break;} //indicates we've exhausted all rooms.

        const guest_idx = get_rand_between(0, numCustomers-1);
        const guest = customerSSN[guest_idx]
        const guest_reg_date = customerRegDate[guest_idx];

        const check_in_employee = get_rand_arr_item(hotel_receptionist_map[hid])
        const check_out_employee = get_rand_arr_item(hotel_receptionist_map[hid])
        if (numBookings != 0) {
            const archive = generateArchive(guest, guest_reg_date, hid, room_num, true, false, problemMap, check_in_employee, check_out_employee);
            archive_insert_query += seedArchive(archive)
            numBookings--
        } else if (numRentals != 0 && !(problemMap[hid][room_num][currDate.getFullYear()] != undefined && problemMap[hid][room_num][currDate.getMonth()+1] != undefined)) {
            // If its a current rental we cant have an ongoing problem in the room.
            const archive = generateArchive(guest, guest_reg_date, hid, room_num, false, true, problemMap, check_in_employee, check_out_employee);
            archive_insert_query += seedArchive(archive)
            numRentals--
        } else {
            const archive = generateArchive(guest, guest_reg_date, hid, room_num, false, false, problemMap, check_in_employee, check_out_employee);
            archive_insert_query += seedArchive(archive)
            numOther--
        }
        rooms = rooms.filter(r => r != room_num)
    }

    await client.query(archive_insert_query);
}

console.log("Seeded Archives!\n")

console.log("Seeding Reviews...")

// sm has 5-10 reviews. md has 10-15 reviews. lg has 20-30 reviews.
for (let hid of hotel_address_ids) {
    let review_query = ""
    const size_data = hotelSizeMapping[hid]
    const minReviews = size_data.size == "sm" ? 5 : size_data.size == "md" ? 10 : 20
    const maxReviews = size_data.size == "sm" ? 10 : size_data.size == "md" ? 15 : 30

    const numReviews = get_rand_between(minReviews, maxReviews);
    const averageStarRating = roll_chance_multi([50, 20, 5, 10, 15], [5, 4, 3, 2, 1])

    const random_author = get_rand_arr_item(customerSSN)

    for (let i = 0; i < numReviews; i++) {
        const review = generateReview(hid, averageStarRating, random_author);
        review_query += seedReview(review)
    }
    await client.query(review_query)
}

console.log("Seeded Reviews!\n")

console.log("\nSeeding complete! \n")

await client.end()