import { dbPool } from "../../../../../../db/pool";

export async function DELETE({params }:any) {

    await dbPool.query(`DELETE FROM hotel WHERE address_id = '${params.hotel_id}'`)

    return new Response(JSON.stringify({ success: true, status: 201 }));
}