import { dbPool } from "../../../../db/pool";
import { authenticate, authorize } from "../../../authentication";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    let fullData = locals.user.SSN == 100000000 ? 
        {SSN: locals.user} : 
        await dbPool.query(`SELECT * FROM hotel NATURAL JOIN address NATURAL JOIN works_in WHERE SSN = ${locals.user.SSN}`).then(v => v.rows[0])
    authorize(fullData, `/hotel/${params.hotel_id}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    //Full Data:
    //  all attributes of hotel (chain_name, address_id)
    //  all attributes of works_in (role, paystruct, pay)
    //  all attributes of associating address
    if (locals.user.SSN == 100000000) {
        const fullD = await dbPool.query(`SELECT * FROM hotel NATURAL JOIN address WHERE address_id = '${params.hotel_id}'`).then(v => v.rows[0])
        fullData = {...fullData, ...fullD, SSN: locals.user}
    }

    return {
        user: {...locals.user},
        pathname: url.pathname,
        manageData: {...fullData, is_manager: fullData.manager_id == locals.user.SSN || locals.user.SSN == 100000000}
    };
}
