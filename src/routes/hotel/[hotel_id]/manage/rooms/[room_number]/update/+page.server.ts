import { authenticate, authorize } from "../../../../../../authentication";
import { dbPool } from "../../../../../../../db/pool";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user, role: 'General Manager'} : 
        await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/hotel/${params.hotel_id}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403}, true)

    const room = await dbPool.query(
        `SELECT 
            r.address_id, r.room_number, r.price, r.capacity, 
            r.view, r.extension_possible, amenities
        FROM room r 
        LEFT JOIN (
            SELECT rha.address_id, rha.room_number, json_agg(amenity_name) AS amenities 
            FROM room_has_amenity rha
            GROUP BY (rha.address_id, rha.room_number)
        ) p ON (p.address_id = r.address_id AND p.room_number = r.room_number)
        WHERE r.address_id = '${params.hotel_id}' AND r.room_number = '${params.room_number}'`
    ).then(v => v.rows[0])
   
    return {
        user: {...locals.user, is_manager: is_employee.role == 'General Manager'},
        hotel_id: params.hotel_id,
        room
    };
}
