import { dbPool } from "../../../../db/pool"
import {v4 as uuidv4} from 'uuid'

export async function POST({request, locals }:any) {
    const {hotel, room_number, from, to} = await request.json()

    const aId = uuidv4()

    await dbPool.query(`
        INSERT INTO archive(archive_id, guest_id, address_id, room_number, status, stay_start_date, stay_end_date)
        VALUES ('${aId}', ${locals.user.SSN}, '${hotel}', ${room_number}, 'booked', '${from}', '${to}')
    `)

    return new Response(JSON.stringify({ success: true, status: 201, archive_id: aId }));
}

export async function GET({url}:any) {
    // Gets all rooms in the hotel that fit that booking start and end date.
   
    const hotel_id = url.searchParams.get('hotel')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    const rooms = await dbPool.query(`
        SELECT r.address_id, r.room_number, r.price, r.capacity, r.view, r.extension_possible, amenities
        FROM room r 
            LEFT JOIN (
                SELECT ra.address_id, ra.room_number, json_agg(amenity_name) as amenities
                FROM room_has_amenity ra
                GROUP BY (ra.address_id, ra.room_number)
            ) rha
            ON (rha.address_id = '${hotel_id}' AND rha.room_number = r.room_number) 

            WHERE r.address_id = '${hotel_id}' AND NOT EXISTS 
            (   
                SELECT 1 
                FROM archive a 
                WHERE a.address_id = '${hotel_id}' AND a.room_number = r.room_number AND 
                a.stay_start_date < '${to}' AND a.stay_end_date > '${from}'
            )
        `
    ).then(v => v.rows);

    return new Response(JSON.stringify({success: true, status: 201, rooms}))
}