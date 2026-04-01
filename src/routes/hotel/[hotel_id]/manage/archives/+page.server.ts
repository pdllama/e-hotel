import { authenticate, authorize } from "../../../../authentication";
import { dbPool } from "../../../../../db/pool";
import {search_hotel_bookings} from "../../../../../db/queries/archive_selects"
import { parse_date } from "../../../../../db/seeding/seedingutils";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const page = url.searchParams.get('p')
    const status = url.searchParams.get('status')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const name = url.searchParams.get('name')
    const room_num = url.searchParams.get('room')

    const startDate = !from ? {year: '', month: '', day: ''} : parse_date(from)
    const endDate = !to ? {year: '', month: '', day: ''} : parse_date(to)

    const truePage = !page ? 0 : isNaN(parseInt(page)) ? 0 : parseInt(page)

    const skip = ((truePage == 0 ? 1 : truePage)-1)*10

    // Need bookings data
    const bookingsData = await dbPool.query(search_hotel_bookings(params.hotel_id, !status ? '' : status, !from ? '' : from, !to ? '' : to, !name ? '' : name, !room_num ? 0 : room_num, skip)).then(v => v.rows)

    return {
        user: {...locals.user},
        hotel_id: params.hotel_id,
        results: bookingsData,
        search_state: {status: !status ? '' : status, from: startDate, to: endDate, page: truePage, name: !name ? '' : name, room: !room_num ? '' : room_num}
    };
}