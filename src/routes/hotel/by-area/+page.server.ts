import { dbPool } from "../../../db/pool";

export async function load({ locals, url }:any) {

    const city = url.searchParams.get('c')

    const trueQuery = !city ? '' : city

    const rooms_by_area = await dbPool.query(
        `
            SELECT * FROM rooms_by_area
            ${city ? `WHERE UPPER(city) LIKE UPPER('%${city}%)` : ''}
            ORDER BY num_avail_rooms DESC
        `
    ).then(v => v.rows)

    return {
        user: locals.user,
        rooms_by_area,
        search_state: trueQuery
    };
}

