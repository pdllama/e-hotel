import { authenticate, authorize } from "../../../../../authentication";
import { dbPool } from "../../../../../../db/pool";
import { error } from "@sveltejs/kit";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user, role: 'General Manager'} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/hotel/${params.hotel_id}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const room = await dbPool.query(
        `SELECT 
            r.address_id, r.room_number, r.price, r.capacity, 
            r.view, r.extension_possible, amenities, 
            (
                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM archive WHERE address_id = '${params.hotel_id}' AND room_number = ${params.room_number} AND (status = 'renting' OR (status = 'booked' AND stay_start_date <= CURRENT_DATE + INTERVAL '7 days'))
                    ) THEN false
                    ELSE true
                END
            ) AS can_rent
        FROM room r 
        LEFT JOIN (
            SELECT rha.address_id, rha.room_number, json_agg(amenity_name) AS amenities 
            FROM room_has_amenity rha
            GROUP BY (rha.address_id, rha.room_number)
        ) p ON (p.address_id = r.address_id AND p.room_number = r.room_number)
        WHERE r.address_id = '${params.hotel_id}' AND r.room_number = '${params.room_number}'`
    ).then(v => v.rows[0])
    if (!room) {
        error(404, "Room Not Found")
    }
    const room_stays_total = await dbPool.query(`SELECT first_name, middle_name, last_name, status, stay_start_date, stay_end_date FROM archive a LEFT JOIN person p ON (a.guest_id = p.SSN) WHERE address_id = '${params.hotel_id}' AND room_number = '${params.room_number}' AND( status = 'booked' OR status = 'renting')`).then(v => v.rows)
    const room_upcoming = room_stays_total.filter(rs => rs.status !== 'renting');
    const room_current_stay = room_stays_total.filter(rs => rs.status === 'renting')[0]
    const room_problems = await dbPool.query(`SELECT * FROM room_problem WHERE address_id = '${params.hotel_id}' AND room_number = '${params.room_number}'`).then(v => v.rows)
   
    return {
        user: {...locals.user, is_manager: is_employee.role == 'General Manager'},
        hotel_id: params.hotel_id,
        room,
        room_stays: room_upcoming,
        room_current_stay,
        room_problems
    };
}
