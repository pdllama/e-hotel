import { error } from "@sveltejs/kit"
import { dbPool } from "../../db/pool"
import { search_hotel } from "../../db/queries/hotel_selects"
import { parseAmenitiesQuery, parsePriceRange } from "./search_logic"

export async function load({url}:any) {
    const q = url.searchParams.get('q')
    const page = url.searchParams.get('page')
    const minRating = url.searchParams.get('rating')
    const priceRange = parsePriceRange(url.searchParams.get('price'))
    const amenities = parseAmenitiesQuery(url.searchParams.get('amenities'))

    const otherQueries = {minRating, priceRange, amenities}
    

    const numResults = 10
    const skip = page == undefined ? 0 : (page-1)*10
    const search_results = await dbPool.query(search_hotel(q, numResults, otherQueries, skip)).then(v => v.rows)
    return {search_results}
}