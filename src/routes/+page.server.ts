import { dbPool } from "../db/pool";

export async function load({ locals }:any) {

    const rooms_by_area = await dbPool.query(
        `
            SELECT * FROM rooms_by_area
            ORDER BY num_avail_rooms DESC
            FETCH FIRST 20 ROWS ONLY
        `
    ).then(v => v.rows)

    return {
        user: locals.user,
        rooms_by_area
    };
}



//EXAMPLE OF PROTECTING ROUTES
//import { redirect } from '@sveltejs/kit';

// export function load({ locals }) {
//     if (!locals.user) {
//         throw redirect(302, '/login');
//     }
// }