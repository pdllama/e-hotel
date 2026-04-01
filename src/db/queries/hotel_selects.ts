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


// The main search querying function. Filters by:
//  1. chain_name/city name by a single query.
//  2. minimum rating
//  3. amenities
//  4. price range
export function search_hotel(query:string, numrows:number, otherQueries:any={}, skip:number=0) {
    const {minRating, priceRange, amenities} = otherQueries // All this information gets formatted before this function is called

    return `
            SELECT address_id, chain_name, city, country, avg_price, avg_rating, amenities, COUNT(*) OVER() AS totalCount
            FROM hotel_search_table as h
            ${build_search_where_clause(query, minRating, priceRange, amenities)}
            OFFSET ${skip} ROWS FETCH NEXT ${numrows} ROWS ONLY
            `
}

function build_search_where_clause(query:string, minRating:number, price_range: {min:number, max:number|string}, amenities: string[]) {
    let baseWhere = 'WHERE'
    if (query) {baseWhere += ` (UPPER(chain_name) LIKE UPPER('%${query}%') OR UPPER(city) LIKE UPPER('%${query}%'))`}
    if (minRating) {baseWhere += ` ${baseWhere == "WHERE" ? '' : 'AND'} avg_rating >= ${minRating}`}
    if (price_range != undefined) {baseWhere += ` ${baseWhere == "WHERE" ? '' : 'AND'} (avg_price > ${price_range.min}${price_range.max == 'inf' ? '' : ` AND avg_price < ${price_range.max}`})`}
    if (amenities != undefined) {
        baseWhere += ` ${baseWhere == "WHERE" ? '' : 'AND'} EXISTS (
            SELECT 1 
            FROM (
            ${hotels_with_all_specified_amenities(amenities)}
            ) am
            WHERE h.address_id = am.address_id
        )`
    }
    return baseWhere == "WHERE" ? "" : baseWhere
}

// This function essentially does R/S where R is the table of hotels and their amenities, and S is the table of amenities we're looking for.
// Allows us to query the hotels by which amenities any of their rooms have.
function hotels_with_all_specified_amenities(amenities:string[]) {
    const searched_for_amenities = build_valid_amenities_table(amenities);
    const query = `
        SELECT address_id
        FROM (${get_all_hotel_amenities()})
        WHERE amenity_name IN (${searched_for_amenities})
        GROUP BY address_id
        HAVING COUNT(*) = (SELECT COUNT(*) FROM (${searched_for_amenities}))
    `
    return query
}

export function build_valid_amenities_table(amenities:string[]) {
    let whereClause = `WHERE`
    for (let i = 0; i < amenities.length ; i++) {
        const amenity = amenities[i]
        whereClause += ` amenity_name = '${amenity}'${i != amenities.length-1 ? ` OR` : ''}`
    }
    return `SELECT amenity_name FROM amenity ${whereClause}`
}

export function get_all_hotel_amenities() {
    return `SELECT DISTINCT address_id, amenity_name FROM room_has_amenity`
}

export function get_specific_hotel(add_id:string) {
    return `SELECT * FROM hotel_show_view WHERE address_id = '${add_id}'`
}

export function get_specific_chain(chain_name:string) {
    return `SELECT * FROM chain_view WHERE chain_name = '${chain_name}'`
}

// SELECT address_id, chain_name, city, country, avg_price, avg_rating, amenity_name
// FROM hotel_search_table NATURAL JOIN (
// 	SELECT DISTINCT ON (address_id, amenity_name) address_id, amenity_name
// 	FROM room_has_amenity
// )