import { dbPool } from "../../../../../../../db/pool";

export async function DELETE({params }:any) {

    await dbPool.query(`DELETE FROM works_in WHERE address_id = '${params.hotel_id}' AND SSN = ${params.SSN}`)

    return new Response(JSON.stringify({ success: true, status: 201 }));
}