import { dbPool } from "../../../../../../../db/pool";

export async function PUT({request }:any) {
    const {hotel_id, room_number, number, price, capacity, view, extension_possible, amenities, prevAmenities} = await request.json()
    
    const setQuery = `
        room_number = ${number}, 
        price = ${price},
        capacity = ${capacity}, 
        view = ${!view ? 'null' : `'${view}'`}, 
        extension_possible = ${extension_possible}
    `
    
    await dbPool.query(`UPDATE room SET ${setQuery} WHERE address_id = '${hotel_id}' AND room_number = ${room_number}`)

    const removedAmenities = amenities.length == 0 ? prevAmenities : prevAmenities.filter((am:string) => !amenities.includes(am))
    const addedAmenities = prevAmenities.length == 0 ? amenities : amenities.filter((am:string) => !prevAmenities.includes(am))

    if (removedAmenities.length != 0) {
        for (let am of removedAmenities) {
            await dbPool.query(`DELETE FROM room_has_amenity WHERE address_id = '${hotel_id}' AND room_number = ${number} AND amenity_name = '${am}'`)
        }
    }

    if (addedAmenities.length != 0) {
        for (let am of addedAmenities) {
            await dbPool.query(`INSERT INTO room_has_amenity(address_id, room_number, amenity_name) VALUES('${hotel_id}', ${number}, '${am}')`)
        }
    }

    return new Response(JSON.stringify({ success: true, status: 201 }));
}