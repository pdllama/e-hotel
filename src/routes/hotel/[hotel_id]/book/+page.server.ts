import { dbPool } from "../../../../db/pool";
import { authenticate } from "../../../authentication";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})

    const hotel = await dbPool.query(`SELECT * FROM hotel WHERE address_id = '${params.hotel_id}'`).then(v => v.rows[0])

    return {
        user: {...locals.user},
        hotel_id: params.hotel_id,
        pathname: url.pathname,
        hotel
    };
}
