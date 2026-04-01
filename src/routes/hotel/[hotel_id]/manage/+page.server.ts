import { authenticate, authorize } from "../../../authentication";
import { dbPool } from "../../../../db/pool";
import {select_hotel_bookings, select_ongoing_problems} from "../../../../db/queries/archive_selects"

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    // Need bookings data
    const bookingsData = await dbPool.query(select_hotel_bookings(params.hotel_id)).then(v => v.rows)
    const problems = await dbPool.query(select_ongoing_problems(params.hotel_id, 0, 3)).then(v => v.rows)

    const upcomingBookings:any[] = []
    const currentRentals:any[] = []

    bookingsData.forEach(a => {
        switch (a.status) {
            case 'booked': upcomingBookings.push(a); break;
            case 'renting': currentRentals.push(a); break;
        }
    })

    return {
        user: {...locals.user},
        hotel_id: params.hotel_id,
        pathname: url.pathname,
        upcomingBookings,
        currentRentals, 
        problems
    };
}
