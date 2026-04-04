import { dbPool } from "../../../../db/pool";
import { authenticate, authorize } from "../../../authentication";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    let authorized = locals.user.SSN == 100000000 
    authorize(authorized, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const validChains = await dbPool.query(`
        SELECT chain_name FROM hotel_chain
    `).then(v => v.rows)

    

    return {
        user: {...locals.user},
        chains: validChains
    };
}
