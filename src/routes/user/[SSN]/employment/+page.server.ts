import { dbPool } from "../../../../db/pool";
import { get_employed_hotels } from "../../../../db/queries/user-management";
import { authenticate, authorize } from "../../../authentication";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    authorize(locals.user.SSN == params.SSN, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const employedData = await dbPool.query(get_employed_hotels(locals.user.SSN)).then(v => v.rows)

    return {
        user: {...locals.user},
        employedData
    };
}