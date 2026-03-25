export function hotel_avg_rating_query() {
    return `
            SELECT address_id, AVG(rating) as avg_rating
            FROM hotel NATURAL JOIN review
            GROUP BY address_id
            `
}

export function hotel_num_rooms_query() {
    return `
            SELECT address_id, COUNT(*) as num_rooms
            FROM hotel NATURAL JOIN room
            GROUP BY address_id
            `
}

// The query performed when you type something into the search bar, and after like 1 second, a 
// dropdown appears showing common results. 
// Only shows the first 5 results.
export function hotel_debounced_query(query:string, numrows:number) {
    return `
            SELECT address_id, chain_name, city, country, avg_price, avg_rating
            FROM hotel_search_table
            WHERE chain_name LIKE '%${query}%'
            FETCH FIRST ${numrows} ROWS ONLY
            `
}

// searches db by city to see if there are hotels in that city, also prompting the user to search all hotel results with that city.
// This one runs first, and if its less than 5, we search above.
export function city_debounced_query(query:string) {
    return `
            SELECT DISTINCT ON (city) city, state, country
            FROM hotel_search_table
            WHERE city LIKE '%${query}%'
            FETCH FIRST 5 ROWS ONLY    
            `
}

export function get_all_hotel_amenities() {
    return `SELECT DISTINCT address_id, amenity_name FROM room_has_amenity`
}

export function get_specific_hotel(add_id:string) {
    return `SELECT * FROM hotel_show_view WHERE address_id = '${add_id}'`
}

// SELECT address_id, chain_name, city, country, avg_price, avg_rating, amenity_name
// FROM hotel_search_table NATURAL JOIN (
// 	SELECT DISTINCT ON (address_id, amenity_name) address_id, amenity_name
// 	FROM room_has_amenity
// )