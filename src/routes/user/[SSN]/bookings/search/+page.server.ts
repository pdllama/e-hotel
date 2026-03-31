import { addNotification } from "$lib/notificationStore";
import { goto } from "$app/navigation";
import { dbPool } from "../../../../../db/pool";
import {select_customer_bookings} from "../../../../../db/queries/archive_selects"

export async function load({ locals, params, url }:any) {
    if (!locals.user) {
        addNotification({body: 'You have to login to view this route!', success: false, errorStatus: 401})
        goto('/login');
    }
    if (locals.user.SSN != params.SSN) {
        addNotification({body: "You aren't authorized to view this route!", success: false, errorStatus: 403})
        goto(`/user/${locals.user.SSN}`);
    }

    const page = url.searchParams.get('p')
    const status = url.searchParams.get('status')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    // Need bookings data
    const bookingsData = await dbPool.query(select_customer_bookings(locals.user.SSN)).then(v => v.rows)

    return {
        user: {...locals.user}

    };
}
