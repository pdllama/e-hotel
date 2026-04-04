import { dbPool } from "../../../../db/pool";

export async function DELETE({params }:any) {

    await dbPool.query(`DELETE FROM hotel_chain WHERE chain_name = '${params.chain_name}'`)

    return new Response(JSON.stringify({ success: true, status: 201 }));
}