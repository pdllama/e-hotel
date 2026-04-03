import { authenticate, authorize } from "../../../../authentication";
import { dbPool } from "../../../../../db/pool";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user, role: 'General Manager'} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/hotel/${params.hotel_id}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})
    
    const page = url.searchParams.get('p')
    const nameQuery = url.searchParams.get('name')
    const roleQuery = url.searchParams.get('role')

    const name = nameQuery ? nameQuery : ''
    const role = roleQuery ? roleQuery : ''

    const truePage = !page ? 0 : isNaN(parseInt(page)) ? 0 : parseInt(page)

    const num_rows = 10
    const skip = ((truePage == 0 ? 1 : truePage)-1)*num_rows

    const finalQuery = `${name ? ` AND (UPPER(first_name) LIKE UPPER('%${name}%') OR UPPER(middle_name) LIKE UPPER('%${name}%') OR UPPER(last_name) LIKE UPPER('%${name}%'))` : ''}
        ${role ? ` AND role = '${role}'::employee_role` : ''}
    `

    const employees = await dbPool.query(`
        SELECT w.SSN, first_name, middle_name, last_name, role, pay, pay_struct, w.address_id, COUNT(*) OVER() as totalCount
        FROM works_in w NATURAL JOIN person 
        WHERE w.address_id = '${params.hotel_id}'${finalQuery} 
        OFFSET ${skip} ROWS FETCH NEXT ${num_rows} ROWS ONLY
    `).then(v => v.rows)

    return {
        user: {...locals.user, is_manager: is_employee.role == 'General Manager'},
        hotel_id: params.hotel_id,
        results: employees,
        search_state: {name, role, page: truePage}
    };
}
