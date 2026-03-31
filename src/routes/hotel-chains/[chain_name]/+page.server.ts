import { dbPool } from "../../../db/pool"
import { get_specific_chain } from "../../../db/queries/hotel_selects"
import { error } from "@sveltejs/kit"


export async function load({params}:any) {
    const chain = await dbPool.query(get_specific_chain(params.chain_name)).then(v => v.rows[0])
    if (!chain) {
        error(404, "Hotel Not Found")
    }
    return {chain}
}