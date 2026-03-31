import { dbPool } from "../../../../db/pool";
import { authenticate, authorize } from "../../../authentication";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    authorize(locals.user.SSN == params.SSN, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    // Need first name middle name last name and address data
    const addressData = await dbPool.query(`SELECT * FROM person p JOIN address a ON (p.address = a.address_id) WHERE SSN = ${locals.user.SSN}`).then(v => v.rows[0])

    return {
        user: {...locals.user, ...addressData},
        pathname: url.pathname
    };
}
