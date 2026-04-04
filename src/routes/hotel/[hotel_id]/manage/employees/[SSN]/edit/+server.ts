import { dbPool } from "../../../../../../../db/pool";

export async function PUT({request }:any) {
    const {hotel_id, SSN, role, pay, pay_struct} = await request.json()
    
    const setQuery = `
        role = '${role}', 
        pay = ${pay},
        pay_struct = '${pay_struct}'
    `
    
    await dbPool.query(`UPDATE works_in SET ${setQuery} WHERE address_id = '${hotel_id}' AND SSN = ${SSN}`);

    if (role == 'General Manager') {
        // There can only be one general manager (the manager id in hotel table) so there has to be some reshuffling.

        const currentGenManager = await dbPool.query(`SELECT manager_id FROM hotel WHERE address_id = '${hotel_id}'`).then(r => r.rows[0])
        
        // Set Curr gen manager to receptionist by default
        await dbPool.query(`UPDATE works_in SET role = 'Receptionist' WHERE SSN = ${currentGenManager.manager_id} AND address_id = '${hotel_id}'`)
        // Lastly, set this current employee to the manager in hotel table.
        await dbPool.query(`UPDATE hotel SET manager_id = ${SSN} WHERE address_id = '${hotel_id}'`)
    }

    return new Response(JSON.stringify({ success: true, status: 201 }));
}