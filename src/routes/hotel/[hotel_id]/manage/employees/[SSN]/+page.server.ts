import { authenticate, authorize } from "../../../../../authentication";
import { dbPool } from "../../../../../../db/pool";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    const is_employee = locals.user.SSN == 100000000 ? 
        {SSN: locals.user, role: 'General Manager'} : await dbPool.query(`SELECT * FROM works_in WHERE SSN = ${locals.user.SSN} AND address_id = '${params.hotel_id}'`).then(v => v.rows[0])
    authorize(is_employee, `/hotel/${params.hotel_id}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})
    

    const employee = await dbPool.query(`
        SELECT w.SSN, first_name, middle_name, last_name, role, pay, pay_struct, education_level, w.address_id, COUNT(*) OVER() as totalCount
        FROM works_in w NATURAL JOIN person NATURAL JOIN employee
        WHERE w.address_id = '${params.hotel_id}' AND w.SSN = ${params.SSN}
    `).then(v => v.rows[0])


    return {
        user: {...locals.user, is_manager: is_employee.role == 'General Manager'},
        hotel_id: params.hotel_id,

        employee
    };
}
