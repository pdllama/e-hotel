import { dbPool } from "../../../../../../db/pool"


export async function POST({request }:any) {
    const {hotel_id, number, price, capacity, view, extension_possible, amenities} = await request.json()
    
    await dbPool.query(`
        INSERT INTO room(address_id, room_number, price, capacity, view, extension_possible) VALUES 
        ('${hotel_id}', ${number}, ${price}, ${capacity}, ${view == null ? view : `'${view}'`}, ${extension_possible})
    `)

    if (amenities.length != 0) {
        for (let am of amenities) {
            await dbPool.query(`INSERT INTO room_has_amenity(address_id, room_number, amenity_name) VALUES ('${hotel_id}', ${number}, '${am}')`)
        }
    }

    return new Response(JSON.stringify({ success: true, status: 201 }));
}