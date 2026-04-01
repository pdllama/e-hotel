import { dbPool } from "../../../../../../../db/pool";

export async function DELETE({params }:any) {

    await dbPool.query(`DELETE FROM room WHERE address_id = '${params.hotel_id}' AND room_number = ${params.room_number}`)

    return new Response(JSON.stringify({ success: true, status: 201 }));
}