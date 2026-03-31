import { authenticate, authorize } from "../../../../authentication";
import { dbPool } from "../../../../../db/pool";
import {search_customer_bookings} from "../../../../../db/queries/archive_selects"
import { parse_date } from "../../../../../db/seeding/seedingutils";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    authorize(locals.user.SSN == params.SSN, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const page = url.searchParams.get('p')
    const status = url.searchParams.get('status')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')

    const startDate = !from ? {year: '', month: '', day: ''} : parse_date(from)
    const endDate = !to ? {year: '', month: '', day: ''} : parse_date(to)

    const truePage = !page ? 0 : isNaN(parseInt(page)) ? 0 : parseInt(page)

    const skip = ((truePage == 0 ? 1 : truePage)-1)*5

    // Need bookings data
    const bookingsData = await dbPool.query(search_customer_bookings(locals.user.SSN, !status ? '' : status, !from ? '' : from, !to ? '' : to, skip)).then(v => v.rows)

    return {
        user: {...locals.user},
        results: bookingsData,
        search_state: {status: !status ? '' : status, from: startDate, to: endDate, page: truePage}
    };
}
