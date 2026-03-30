import { addNotification } from "$lib/notificationStore";
import { goto } from "$app/navigation";
import { dbPool } from "../../../../db/pool";

export async function load({ locals, params, url }:any) {
    if (!locals.user) {
        addNotification({body: 'You have to login to view this route!', success: false, errorStatus: 401})
        goto('/login');
    }
    if (locals.user.SSN != params.SSN) {
        addNotification({body: "You aren't authorized to view this route!", success: false, errorStatus: 403})
        goto(`/user/${locals.user.SSN}`);
    }

    // Need first name middle name last name and address data
    const addressData = await dbPool.query(`SELECT * FROM person p JOIN address a ON (p.address = a.address_id) WHERE SSN = ${locals.user.SSN}`).then(v => v.rows[0])

    return {
        user: {...locals.user, ...addressData},
        pathname: url.pathname
    };
}
