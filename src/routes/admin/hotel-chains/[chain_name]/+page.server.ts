import { dbPool } from "../../../../db/pool";
import { authenticate, authorize } from "../../../authentication";

export async function load({ locals, params, url }:any) {
    authenticate(locals, '/login', {body: 'You have to login to view this route!', success: false, errorStatus: 401})
    let authorized = locals.user.SSN == 100000000 
    authorize(authorized, `/user/${locals.user.SSN}`, {body: "You aren't authorized to view this route!", success: false, errorStatus: 403})

    const chain = await dbPool.query(`
        SELECT *
        FROM hotel_chain hc
            JOIN address a ON (hc.co_address = a.address_id)
            LEFT JOIN (
                SELECT chain_name, json_agg(phone_number) as phone_numbers
                FROM chain_phone_number
                WHERE chain_name = '${params.chain_name}'
                GROUP BY (chain_name)
            ) hcpn ON (hc.chain_name = hcpn.chain_name)
            LEFT JOIN (
                SELECT chain_name, json_agg(e_mail) as emails
                FROM chain_email
                WHERE chain_name = '${params.chain_name}'
                GROUP BY (chain_name)
            ) hce ON (hc.chain_name = hce.chain_name)
        WHERE hc.chain_name = '${params.chain_name}'
    `).then(v => v.rows[0])

    

    return {
        user: {...locals.user},
        chain_name: params.chain_name,
        chain
    };
}
