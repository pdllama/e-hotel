import { dbPool } from "../../../../../../db/pool";

export async function PUT({request, locals }:any) {
    const {archiveId, is_check_in} = await request.json()

    const currTimeStamp = new Date().toISOString()

    const rentalQuery = is_check_in ? `INSERT INTO rental(archive_id, checked_in_by, check_in_time) VALUES ('${archiveId}', ${locals.user.SSN == 100000000 ? null : locals.user.SSN}, '${currTimeStamp}')` : 
        `UPDATE rental SET checked_out_by = ${locals.user.SSN == 100000000 ? null : locals.user.SSN}, check_out_time = '${currTimeStamp}' WHERE archive_id = '${archiveId}'`

    const archiveQuery = `UPDATE archive SET status = '${is_check_in ? 'renting' : 'completed'}' WHERE archive_id = '${archiveId}'`
    
    await dbPool.query(rentalQuery)
    await dbPool.query(archiveQuery)

    return new Response(JSON.stringify({ success: true, status: 201 }));
}