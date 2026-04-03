import { authenticate, authorize } from "../../../../../authentication";
import { dbPool } from "../../../../../../db/pool";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user, role: 'General Manager'} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/hotel/${params.hotel_id}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})
   
    const hotelBasics = await dbPool.query(`
        SELECT * 
        FROM hotel h 
            JOIN person p ON (p.SSN = h.manager_id)
            LEFT JOIN (
                SELECT address_id, json_agg(phone_number) as phone_numbers
                FROM hotel_phone_number
                WHERE address_id = '${params.hotel_id}'
                GROUP BY (address_id)
            ) hpn ON (h.address_id = hpn.address_id)
            LEFT JOIN (
                SELECT address_id, json_agg(e_mail) as emails
                FROM hotel_email
                WHERE address_id = '${params.hotel_id}'
                GROUP BY (address_id)
            ) he ON (h.address_id = he.address_id)
        WHERE h.address_id = '${params.hotel_id}'
    `).then(v => v.rows[0])

    return {
        user: {...locals.user, is_manager: is_employee.role == 'General Manager'},
        hotel_id: params.hotel_id,
        hotel: hotelBasics
    };
}
