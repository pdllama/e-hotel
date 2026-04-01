import { build_valid_amenities_table } from "./hotel_selects"

export function search_room(
    hotel_id:string, 
    start_availability:string, end_availability:string,
    price_range:number[], amenities:string[],
    capacity:number, view:string, extension_possible:string,
    num_rows:number, skip:number
) {
    return `
        SELECT r.address_id, r.room_number, price, capacity, view, extension_possible, amenities, COUNT(*) OVER() as totalCount
        FROM room r 
            LEFT JOIN (
                SELECT room_number, address_id, json_agg(amenity_name) AS amenities
                FROM room_has_amenity
                GROUP BY (room_number, address_id)
            ) rha 
            ON (r.room_number = rha.room_number AND r.address_id = rha.address_id)
        ${search_room_where(hotel_id, start_availability, end_availability, price_range, amenities, capacity, view, extension_possible)}
        OFFSET ${skip} ROWS FETCH NEXT ${num_rows} ROWS ONLY
    `

}
// address_id              UUID,
//     room_number             INTEGER,
//     price                   INTEGER,
//     capacity                INTEGER,
//     view                    room_view,
//     extension_possible      BOOLEAN,

function search_room_where(
    hotel_id:string, 
    start_availability:string, end_availability:string,
    price_range:number[], amenities:string[],
    capacity:number, view:string, extension_possible:string
) {
    let baseWhere = `WHERE r.address_id = '${hotel_id}'`
    if (start_availability && end_availability) {
        baseWhere += ` AND NOT EXISTS (
            SELECT 1 
            FROM archive a
            WHERE (status = 'booked' OR status = 'renting') 
                AND stay_start_date < '${end_availability}' 
                AND stay_end_date > '${start_availability}'
                AND address_id = '${hotel_id}'
                AND a.room_number = r.room_number
        )`
    }
    if (price_range.length != 0) {
        baseWhere += ` AND price > ${price_range[0]} AND price < ${price_range[1]}`
    }
    if (amenities.length != 0) {
        baseWhere += ` AND EXISTS (
            SELECT 1 
            FROM (
                ${rooms_with_all_specified_amenities(hotel_id, amenities)}
            ) am
            WHERE r.room_number = am.room_number
        )`
    }
    if (capacity) {
        baseWhere += ` AND capacity = ${capacity}`
    }
    if (view) {
        if (view == 'none') {baseWhere += ` AND view IS NULL`}
        else {baseWhere += ` AND view = '${view}'`}
    }
    if (extension_possible) {
        if (extension_possible == 'true') {baseWhere += ' AND extension_possible = true'}
        else {baseWhere += ' AND extension_possible = false'}
    }
    return baseWhere
}

function rooms_with_all_specified_amenities(hotel_id:string, amenities:string[]) {
    const searched_for_amenities = build_valid_amenities_table(amenities);
    const query = `
        SELECT room_number
        FROM (${get_all_room_amenities(hotel_id)})
        WHERE amenity_name IN (${searched_for_amenities})
        GROUP BY room_number
        HAVING COUNT(*) = (SELECT COUNT(*) FROM (${searched_for_amenities}))
    `
    return query
}

function get_all_room_amenities(hotel_id:string) {
    return `SELECT room_number, amenity_name FROM room_has_amenity WHERE address_id = '${hotel_id}'`
}


function get_room_summary(hotel_id:string, room_number:number) {
    return `
        SELECT 
    `
}