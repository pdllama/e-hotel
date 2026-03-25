import { error } from "@sveltejs/kit"
import { dbPool } from "../../../db/pool"
import { get_specific_hotel } from "../../../db/queries/hotel_selects"


export async function load({params}:any) {
    const hotel = await dbPool.query(get_specific_hotel(params.hotel_id)).then(v => v.rows[0])
    if (!hotel) {
        error(404, "Hotel Not Found")
    }
    return {results: hotel}
}