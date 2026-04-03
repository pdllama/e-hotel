import { dbPool } from "../../../../../../../db/pool";

export async function PUT({request }:any) {
    const {hotel_id, SSN, role, pay, pay_struct} = await request.json()
    
    const setQuery = `
        role = '${role}', 
        pay = ${pay},
        pay_struct = '${pay_struct}'
    `
    
    await dbPool.query(`UPDATE works_in SET ${setQuery} WHERE address_id = '${hotel_id}' AND SSN = ${SSN}`);

    return new Response(JSON.stringify({ success: true, status: 201 }));
}