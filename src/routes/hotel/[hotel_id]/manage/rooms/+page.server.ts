import { authenticate, authorize } from "../../../../authentication";
import { dbPool } from "../../../../../db/pool";
import { parse_date } from "../../../../../db/seeding/seedingutils";
import { search_room } from "../../../../../db/queries/room_select";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user, role: 'General Manager'} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/hotel/${params.hotel_id}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    // All possible filtering parameters. It's... a lot.
    
    const page = url.searchParams.get('p')
    const extension_possible_query = url.searchParams.get('ext')
    const viewQuery = url.searchParams.get('view')
    const capacityQuery = url.searchParams.get('capacity')
    const price_range_query = url.searchParams.get('price')
    const from = url.searchParams.get('from')
    const to = url.searchParams.get('to')
    const amenitiesQuery = url.searchParams.get('amenities')


    const startDate = !from ? {year: '', month: '', day: ''} : parse_date(from)
    const endDate = !to ? {year: '', month: '', day: ''} : parse_date(to)
    const amenities = amenitiesQuery ? amenitiesQuery.split(';') : []


    const price_range_step = price_range_query ? price_range_query.split("-") : []
    let price_range = {price_from: '',  price_to: ''}

    if (price_range_step.length == 2) {
        const parsed = price_range_step.map((p:string) => parseInt(p))
        if (isNaN(parsed[0]) || isNaN(parsed[1])) {}
        else {price_range.price_from = parsed[0]; price_range.price_to = parsed[1]}
    }
    
    const capacity = capacityQuery ? capacityQuery : ''
    const view = viewQuery ? viewQuery : ''
    const extension_possible = extension_possible_query ? extension_possible_query : ''

    const truePage = !page ? 0 : isNaN(parseInt(page)) ? 0 : parseInt(page)

    const num_rows = 15
    const skip = ((truePage == 0 ? 1 : truePage)-1)*num_rows

    const rooms = await dbPool.query(search_room(
        params.hotel_id, from, to, 
        price_range.price_to != "" ? ([price_range.price_from, price_range.price_to] as unknown) as number[] : [], 
        amenities, capacity, view, extension_possible, num_rows, skip)).then(v => v.rows)


    return {
        user: {...locals.user, is_manager: is_employee.role == 'General Manager'},
        hotel_id: params.hotel_id,
        results: rooms,
        search_state: {
            from: startDate, to: endDate, price_range,
            amenities, capacity, view, extension_possible,
            page: truePage
        }
    };
}
