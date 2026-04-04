import { dbPool } from "../../../../db/pool";
import { authenticate, authorize } from "../../../authentication";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    let authorized = locals.user.SSN == 100000000 
    authorize(authorized, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const hotel = await dbPool.query(`
        SELECT *, COUNT(*) OVER() as totalCount
        FROM hotel NATURAL JOIN address
        WHERE address_id = '${params.hotel_id}'
    `).then(v => v.rows[0])

    

    return {
        user: {...locals.user},
        hotel_id: params.hotel_id,
        hotel
    };
}
