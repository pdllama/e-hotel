
import { authenticate, authorize } from "../../../authentication";
import { dbPool } from "../../../../db/pool";
import {select_customer_bookings} from "../../../../db/queries/archive_selects"

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    authorize(locals.user.SSN == params.SSN, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    // Need bookings data
    const bookingsData = await dbPool.query(select_customer_bookings(locals.user.SSN)).then(v => v.rows)

    const upcomingBookings:any[] = []
    const currentRentals:any[] = []
    const pastStays:any[] = []
    const cancelledBookings:any[] = []

    bookingsData.forEach(a => {
        switch (a.status) {
            case 'booked': upcomingBookings.push(a); break;
            case 'renting': currentRentals.push(a); break;
            case 'completed': pastStays.push(a); break;
            default: cancelledBookings.push(a);
        }
    })

    return {
        user: {...locals.user},
        pathname: url.pathname,
        upcomingBookings,
        currentRentals, 
        pastStays,
        cancelledBookings
    };
}
