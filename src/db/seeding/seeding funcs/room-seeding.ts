import { get_rand_idx, roll_chance_binary, roll_chance_multi } from "../seedingutils";

// Note: We differentiate room-specific vs hotel-specific amenities in the calculations here when there's no such distinction in the db (only room-specific).
// This is just used to seed dynamic, sensible prices.
// Amenities are found in room-amenities.json in seeding

const hotel_amenities = [
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
    extension_possible: boolean
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
        extension_possible: false
    }

    room.price = base_prices[room.capacity == 1 ? "base" : room.capacity == 2 ? "two" : "four"]

    if (roll_chance_binary(10)) {
        // roll for view
    }

    // todo: roll for amenities, roll for extension, update price, roll for problem.

}


export function decideBaseRoomPrice(
    hotel_size:string
) {
    const min = hotel_size == 'sm' ? 50 : hotel_size == "md" ? 71 : 151
    const max = hotel_size == 'sm' ? 70 : hotel_size == 'md' ? 150 : 249
    const base_price = Math.floor(Math.random() * (max - min + 1)) + min;

    const cap2Price = base_price * (Math.floor(Math.random() * (2 - 1.5 + 1)) + 1.5); // random num between 1.5-2
    const cap4Price = base_price * (Math.floor(Math.random() * (4 - 3 + 1)) + 3); // random num between 3-4

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
            const randAmn = freeAmns[get_rand_idx(freeAmns.length)]
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
            const randAmn = freeAmns[get_rand_idx(freeAmns.length)]
            amns.push(randAmn);
            freeAmns = freeAmns.filter(am => am != randAmn);
        }
    }
    return amns;
}