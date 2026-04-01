import { authenticate, authorize } from "../../../../../authentication";
import { dbPool } from "../../../../../../db/pool";
import {get_archive} from "../../../../../../db/queries/archive_selects"

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const archive = await dbPool.query(get_archive(params.archive_id, true)).then(v => v.rows[0])

    return {
        user: {...locals.user},
        archive
    };
}
