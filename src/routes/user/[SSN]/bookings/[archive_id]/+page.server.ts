import { authenticate, authorize } from "../../../../authentication";
import { dbPool } from "../../../../../db/pool";
import {get_archive, search_customer_bookings} from "../../../../../db/queries/archive_selects"
import { parse_date } from "../../../../../db/seeding/seedingutils";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    authorize(locals.user.SSN == params.SSN, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const archive = await dbPool.query(get_archive(params.archive_id)).then(v => v.rows[0])


    return {
        user: {...locals.user},
        archive
    };
}
