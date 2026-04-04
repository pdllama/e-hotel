import { dbPool } from "../../../db/pool";
import { authenticate, authorize } from "../../authentication";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    let authorized = locals.user.SSN == 100000000 
    authorize(authorized, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

      
    const page = url.searchParams.get('p')
    const query = url.searchParams.get('q')

    const trueQuery = !query ? '' : query
    const truePage = !page ? 0 : isNaN(parseInt(page)) ? 0 : parseInt(page)

    const num_rows = 10
    const skip = ((truePage == 0 ? 1 : truePage)-1)*num_rows

    const chains = await dbPool.query(`
        SELECT *, COUNT(*) OVER() as totalCount
        FROM hotel_chain
        ${query ? ` WHERE UPPER(chain_name) LIKE UPPER('%${trueQuery}%')` : ''}
         OFFSET ${skip} ROWS FETCH NEXT ${num_rows} ROWS ONLY
    `).then(v => v.rows)

    

    return {
        user: {...locals.user},
        pathname: url.pathname,
        chains,
        search_state: {query: trueQuery, page: truePage}
    };
}
