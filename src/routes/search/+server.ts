import { city_debounced_query, hotel_debounced_query } from "../../db/queries/hotel_selects"
import { dbPool } from "../../db/pool";
import { json } from "@sveltejs/kit";

export async function GET({url}:any) {
    const query = url.searchParams.get('q') ?? '';

    
    if (!query) {return [];}

    const is_debounced = url.searchParams.get('debounced') == 'true';

    if (is_debounced) {
        let num = 5
        const cities = await dbPool.query(city_debounced_query(query)).then(r => r.rows);
        num -= cities.length

        if (num > 0) {
            const result = await dbPool.query(hotel_debounced_query(query, num)).then(r => r.rows);
            for (let r of result) {
                cities.push(r)
            }
        }
        
        return json(cities);
    } else {
        
    }
}