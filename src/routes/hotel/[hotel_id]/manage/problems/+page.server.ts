import { authenticate, authorize } from "../../../../authentication";
import { dbPool } from "../../../../../db/pool";
import { get_all_problems } from "../../../../../db/queries/hotel_selects";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const room = url.searchParams.get('room')
    const page = url.searchParams.get('p')

    const truePage = !page ? 0 : isNaN(parseInt(page)) ? 0 : parseInt(page)
    const skip = ((truePage == 0 ? 1 : truePage)-1)*10


    const problems = await dbPool.query(get_all_problems(params.hotel_id, !room ? 0 : room, 10, skip)).then(v => v.rows)

    const initState = {room: !room ? '' : room, page: truePage}

    return {
        user: {...locals.user},
        hotel_id: params.hotel_id,
        pathname: url.pathname,
        problems,
        initState
    };
}
