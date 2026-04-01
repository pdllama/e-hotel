import { authenticate, authorize } from "../../../../../../authentication";
import { dbPool } from "../../../../../../../db/pool";
import { error } from "@sveltejs/kit";
import { get_nearest_booking } from "../../../../../../../db/queries/archive_selects";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user, role: 'General Manager'} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/hotel/${params.hotel_id}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const minimum_stay = await dbPool.query(get_nearest_booking(params.hotel_id, params.room_number)).then(v => v.rows)
    
    return {
        user: {...locals.user, is_manager: is_employee.role == 'General Manager'},
        room_number: params.room_number,
        hotel_id: params.hotel_id,
        minimum_stay
    };
}
