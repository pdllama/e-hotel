import { roll_chance_binary, roll_chance_multi, get_rand_between, get_rand_arr_item, type Hotel_Stats } from "../seedingutils.ts";
import { generateRoomProblem, type RoomProblem } from "./room-problem-seeding.ts";

// Note: We differentiate room-specific vs hotel-specific amenities in the calculations here when there's no such distinction in the db (only room-specific).
// This is just used to seed dynamic, sensible prices.
// Amenities are found in room-amenities.json in seeding

export const hotel_amenities = [
    "Air Conditioning", "Heating", "Wi-Fi", "Room Service", "Toiletries", "Soundproofing",
    "Eco-friendly Amenities", "Baby Cot", "Wheelchair Accessible", "Pet-friendly" 
]
const otherAmnsLarge = ["Soundproofing","Eco-friendly Amenities", "Baby Cot", "Wheelchair Accessible", "Pet-friendly" ]
const otherAmnsMd = ["Room Service", "Toiletries", "Soundproofing",
    "Eco-friendly Amenities", "Baby Cot", "Wheelchair Accessible", "Pet-friendly" ]
const room_amenities = [
    "Television", "Mini Bar", "Refrigerator", "Coffee Maker", "Safe", "Desk", 
    "Seating Area", "Hair Dryer", "Bathrobe", "Slippers", "Bathtub", "Iron", 
    "Closet", "Electric Kettle", "Microwave", "Alarm Clock", "Laptop Safe", 
    "Universal Power Outlets", "Streaming Services", "Room Lighting Control",
    "Telephone with Voicemail", "Intercom", "Wi-Fi Printer", "LED Mood Lighting",
    "Charging Stations", "Bluetooth Speaker", "Streaming HDMI Ports", "Welcome Snacks",
    "Coffee & Tea Supplies", "Extra Bed", "Hypoallergenic Bedding", "Blackout Curtains", 
    "Balcony"
]

export interface RoomType {
    address_id: string,
    room_number: number, 
    price: number, 
    capacity: number,
    view?: string,
    extension_possible: boolean,
    problem?: RoomProblem
}

export function generateRoom(
    hotel_address_id: string, 
    room_number: number,
    hotel_size: string,
    base_prices:any
) {
    // price per room typically depends on numerous factors such as location, luxury level, etc.
    // but in general here is how the price is decided:
    //  base: 50-70$ per night (single bed) for small hotel, 71-150 for med hotel, 151-249 for large hotel.
    //  x1.5-2 for capacity of 2, x3-4 for capacity of 4 beds (max capacity)
    //  So the base price per hotel is decided for every room capacity BEFOREHAND, as per decideBaseRoomPrice function
    // Then the rooms can have the following modifiers:
    //      mountain/sea view: +75-125$ flat. 10% chance per room to have a view, 50% chance for either view
    //      extension possible: +10-40$ flat. 30% chance per room to have extension possible.
    //      every room-specific amenity: +10-15$ flat. 
    // We also roll:
    //      5% chance for the room to have a problem
    //      1% chance for the room to have an ongoing problem

    const room:RoomType = {
        address_id: hotel_address_id,
        room_number: room_number,
        capacity: roll_chance_multi([60, 30, 10], [1, 2, 4]), // 60% chance for 1 bed, 30% chance for 2 bed, 10% chance for 4 bed
        price: 0,
        view: undefined,
        extension_possible: false,
        problem: undefined
    }

    room.price = base_prices[room.capacity == 1 ? "base" : room.capacity == 2 ? "two" : "four"]

    if (roll_chance_binary(10)) {
        // roll for view
        room.view = roll_chance_binary(50) ? "mountain" : "sea"
        room.price += get_rand_between(75, 125)
    }

    if (roll_chance_binary(30)) {
        //extension possible
        room.extension_possible = true;
        room.price += get_rand_between(10, 40)
    }

    const room_amns = roll_room_amenities(hotel_size)
    for (let i=0;i<room_amns.length;i++) {room.price += get_rand_between(10, 15)}

    const problem_type = roll_chance_multi([95, 4, 1], ["none", "resolved", "ongoing"])
    if (problem_type != "none") {
        room.problem = generateRoomProblem(hotel_address_id, room_number, problem_type)
    }

    return {room, room_amns}
}


export function decideBaseRoomPrice(
    hotel_size:string
) {
    const min = hotel_size == 'sm' ? 50 : hotel_size == "md" ? 71 : 151
    const max = hotel_size == 'sm' ? 70 : hotel_size == 'md' ? 150 : 249
    const base_price = Math.floor(Math.random() * (max - min + 1)) + min;

    const cap2Price = Math.floor(base_price * get_rand_between(1.5, 2)); // random num between 1.5-2
    const cap4Price = Math.floor(base_price * get_rand_between(3, 4)); // random num between 3-4

    return {base: base_price, two: cap2Price, four: cap4Price}
}

export function decideHotelAmenities(
    hotel_size:string
) {
    const base_amns = hotel_size == "lg" ? ["Air Conditioning", "Heating", "Wi-Fi", "Room Service", "Toiletries"] : 
        hotel_size == "md" ? ["Air Conditioning", "Heating", "Wi-Fi"] : []
    const other_amns = hotel_size == "lg" ? otherAmnsLarge : hotel_size == "md" ? otherAmnsMd : hotel_amenities

    const numOtherAmns = roll_num_amns(other_amns)

    if (numOtherAmns != 0) {
        let freeAmns = other_amns.map(am => am);
        for (let i=0;i<numOtherAmns;i++) {
            const randAmn = get_rand_arr_item(freeAmns)
            base_amns.push(randAmn);
            freeAmns = freeAmns.filter(am => am != randAmn);
        }
    }

    return base_amns
}

function roll_num_amns(other_amns:string[]) {
    return Math.floor(Math.floor(Math.random()*other_amns.length) * (Math.random()))
    // Get a random number between all of the other amenities * anywhere between 0-1.
    // This will skew the num of other hotel amns to be less so that theres less rows in has_amenity
    // While still allowing it to be possible to have every hotel amenity.
}

function roll_room_amenities(hotel_size: string) {
    const base_num = hotel_size == "lg" ? 5 : hotel_size == "md" ? 3 : 1 //amenity number
    const num_amns = Math.floor((Math.random()*base_num) * (Math.random()));
    const amns = []

    if (num_amns != 0) {
        let freeAmns = room_amenities.map(am => am);
        for (let i=0;i<num_amns;i++) {
            const randAmn = get_rand_arr_item(freeAmns)
            amns.push(randAmn);
            freeAmns = freeAmns.filter(am => am != randAmn);
        }
    }
    return amns;
}

export function roll_num_of_rooms(hotel_size:string) {
    return hotel_size == "sm" ? get_rand_between(10, 60) : hotel_size == "md" ? get_rand_between(61, 120) : get_rand_between(121, 150)
}

export function roll_room_assignments(hotel_size: string) {
    // This function rolls the room assignments per floor of a hotel. Aka, how the room numbers will be labelled.
    // By default:
    //  - Rooms always start on the second floor (200-300)
    //  - Room x00 and x01 (ex 200, 201, 300, 301) is always reserved for every hotel.
    //      - Medium and large size hotels may have x00-x03 and x00-x05 reserved (rolled) for other purposes
    //  - small hotels will assign 30-35 rooms per floor
    //  - med hotels will assign 25-30 rooms per floor
    //  - large hotels will assign 20-25 rooms per floor 


    // sm has no extra reserved rooms per floor (0), md has up to 2 extra reserved rooms per floor (2), lg has up to 4 (4).
    const extra_reserved_assignments = hotel_size == "sm" ? 0 : Math.floor((Math.random()*(hotel_size == "md" ? 3 : 5))) 
    

    // rpf = rooms per floor
    const baseline_rpf = hotel_size == "sm" ? 30 : hotel_size == "md" ? 25 : 20
    const extra_rpf = Math.floor((Math.random()*6))

    return {rpf: baseline_rpf + extra_rpf, reserved: 1+extra_reserved_assignments}
}